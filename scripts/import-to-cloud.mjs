#!/usr/bin/env node
/**
 * Importa registros (cuentas, movimientos, pagos, deudas e inversiones) desde un archivo JSON a
 * tu cuenta de Gastito en la nube. Sirve para cargar de una vez lo que sale de resúmenes o
 * capturas del banco.
 *
 * Uso (en TU terminal, con la app cerrada en el navegador):
 *   node scripts/import-to-cloud.mjs ruta/a/datos.json
 *
 * El formato del JSON está en `scripts/import-data.example.json`. No commitees tu archivo de
 * datos: tiene tus finanzas (`import-data*.json` está en .gitignore salvo el ejemplo).
 *
 * Te pide email, contraseña de la cuenta y clave del hogar acá mismo: no se guardan ni se mandan
 * a ningún lado salvo el login a tu Supabase. Los datos se descifran en tu PC, se agregan y se
 * vuelven a subir cifrados (mismo formato que la app). Antes de guardar muestra todo lo que va
 * a agregar, pide confirmación y deja un respaldo del vault anterior que se puede importar
 * desde la app.
 *
 * Es idempotente: cada registro tiene un id fijo (`import-<lote>-<key>`), así que correrlo dos
 * veces con el mismo archivo no duplica nada.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { webcrypto as crypto } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ACCOUNT_TYPES = ['BANK', 'CASH', 'CREDIT_CARD']
const DATE = /^\d{4}-\d{2}-\d{2}$/
const KEY = /^[a-z0-9-]+$/

// ---------------------------------------------------------------------------------------------
// Validación del archivo de datos
// ---------------------------------------------------------------------------------------------

/** Valida el JSON de datos y devuelve la lista de errores (vacía si está bien). */
export function validateImportData(data) {
  const errors = []
  const fail = (where, message) => errors.push(`${where}: ${message}`)
  const isNumber = (value) => typeof value === 'number' && Number.isFinite(value)
  const isText = (value) => typeof value === 'string' && value.trim().length > 0

  if (typeof data !== 'object' || data === null) return ['El archivo no es un objeto JSON']
  if (!isText(data.batch) || !KEY.test(data.batch)) {
    fail('batch', 'obligatorio, solo minúsculas, números y guiones (ej. "2026-11")')
  }

  const accountKeys = new Set()
  const checkKeys = (list, name) => {
    const seen = new Set()
    for (const [index, item] of (list ?? []).entries()) {
      const where = `${name}[${index}]`
      if (!isText(item?.key) || !KEY.test(item.key)) fail(where, 'falta "key" (minúsculas, números y guiones)')
      else if (seen.has(item.key)) fail(where, `"key" repetida: ${item.key}`)
      else seen.add(item.key)
    }
    return seen
  }

  const notLists = ['accounts', 'movements', 'payments', 'debts', 'savings'].filter(
    (name) => data[name] !== undefined && !Array.isArray(data[name])
  )
  for (const name of notLists) fail(name, 'tiene que ser una lista')
  if (notLists.length > 0) return errors

  for (const key of checkKeys(data.accounts, 'accounts')) accountKeys.add(key)
  const paymentKeys = checkKeys(data.payments, 'payments')
  checkKeys(data.movements, 'movements')
  checkKeys(data.debts, 'debts')
  checkKeys(data.savings, 'savings')

  for (const [index, account] of (data.accounts ?? []).entries()) {
    const where = `accounts[${index}]`
    if (!isText(account.name)) fail(where, 'falta "name"')
    if (!ACCOUNT_TYPES.includes(account.type)) fail(where, `"type" tiene que ser ${ACCOUNT_TYPES.join(', ')}`)
    if (account.balance !== undefined && !isNumber(account.balance)) fail(where, '"balance" tiene que ser un número')
    for (const field of ['closingDay', 'dueDay']) {
      const day = account[field]
      if (day !== undefined && !(Number.isInteger(day) && day >= 1 && day <= 31)) fail(where, `"${field}" entre 1 y 31`)
    }
    if (account.match !== undefined) {
      try {
        new RegExp(account.match, 'i')
      } catch {
        fail(where, '"match" no es una expresión regular válida')
      }
    }
  }

  for (const [index, movement] of (data.movements ?? []).entries()) {
    const where = `movements[${index}]`
    if (!accountKeys.has(movement.account)) fail(where, `"account" tiene que ser una key de accounts`)
    if (!DATE.test(movement.date ?? '')) fail(where, '"date" en formato AAAA-MM-DD')
    if (!isNumber(movement.amount) || movement.amount <= 0) fail(where, '"amount" positivo')
    if (movement.type !== undefined && !['EXPENSE', 'INCOME'].includes(movement.type)) fail(where, '"type" EXPENSE o INCOME')
    if (movement.currency !== undefined && !['ARS', 'USD'].includes(movement.currency)) fail(where, '"currency" ARS o USD')
    if (!isText(movement.note)) fail(where, 'falta "note"')
    if (movement.payment !== undefined && !paymentKeys.has(movement.payment)) fail(where, '"payment" tiene que ser una key de payments')
  }

  for (const [index, payment] of (data.payments ?? []).entries()) {
    const where = `payments[${index}]`
    if (!accountKeys.has(payment.account)) fail(where, `"account" tiene que ser una key de accounts`)
    if (!isText(payment.concept) || !isText(payment.entity)) fail(where, 'faltan "concept" o "entity"')
    if (!isNumber(payment.amount) || payment.amount <= 0) fail(where, '"amount" positivo')
    if (!DATE.test(payment.dueDate ?? '')) fail(where, '"dueDate" en formato AAAA-MM-DD')
    if (!isText(payment.category)) fail(where, 'falta "category" (nombre de la categoría)')
    if (payment.frequency !== undefined && !['DAILY', 'MONTHLY', 'YEARLY', 'ONCE'].includes(payment.frequency)) {
      fail(where, '"frequency" DAILY, MONTHLY, YEARLY u ONCE')
    }
  }

  for (const [index, debt] of (data.debts ?? []).entries()) {
    const where = `debts[${index}]`
    if (!isText(debt.name) || !isText(debt.counterparty)) fail(where, 'faltan "name" o "counterparty"')
    if (!isNumber(debt.principal) || !isNumber(debt.outstandingBalance)) fail(where, 'faltan "principal" u "outstandingBalance"')
    if (debt.nextInstallmentDate !== undefined && !DATE.test(debt.nextInstallmentDate)) fail(where, '"nextInstallmentDate" AAAA-MM-DD')
  }

  for (const [index, saving] of (data.savings ?? []).entries()) {
    const where = `savings[${index}]`
    if (!isText(saving.name) || !isNumber(saving.principal)) fail(where, 'faltan "name" o "principal"')
  }

  return errors
}

// ---------------------------------------------------------------------------------------------
// Aplicar al vault (función pura: se puede probar sin red)
// ---------------------------------------------------------------------------------------------

const normalize = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/**
 * Agrega los datos al vault (lo modifica) y devuelve el detalle de qué se agregó y qué ya estaba.
 * `data` tiene que haber pasado `validateImportData`.
 */
export function applyImport(vault, data) {
  const ID = (kind, key) => `import-${data.batch}-${kind}-${key}`
  const report = { added: [], skipped: [], notes: [] }
  const has = (list, id) => list.some((item) => item.id === id)

  // Categorías de gasto por nombre (sin importar mayúsculas ni tildes); si falta, se crea.
  const categoryIdByName = new Map()
  const resolveCategory = (name) => {
    const wanted = normalize(name)
    if (categoryIdByName.has(wanted)) return categoryIdByName.get(wanted)
    let category = vault.categories.find((item) => item.kind === 'EXPENSE' && normalize(item.name) === wanted)
    if (!category) {
      category = { id: ID('category', wanted.replace(/[^a-z0-9]+/g, '-')), name: name.trim(), kind: 'EXPENSE' }
      if (!has(vault.categories, category.id)) {
        vault.categories.push(category)
        report.added.push(`Categoría "${category.name}"`)
      }
    }
    categoryIdByName.set(wanted, category.id)
    return category.id
  }

  // Cuentas: por id del lote, o una existente del mismo tipo cuyo nombre coincida con `match`.
  const accounts = new Map()
  for (const item of data.accounts ?? []) {
    const pattern = item.match ? new RegExp(item.match, 'i') : null
    let account =
      vault.accounts.find((existing) => existing.id === ID('account', item.key)) ??
      (pattern
        ? vault.accounts.find((existing) => existing.type === item.type && pattern.test(normalize(existing.name)))
        : undefined)
    if (account) {
      report.skipped.push(`Cuenta: uso la que ya existe, "${account.name}" (no toco su saldo)`)
      if (item.type === 'CREDIT_CARD') {
        if (!account.closingDay && item.closingDay) account.closingDay = item.closingDay
        if (!account.dueDay && item.dueDay) account.dueDay = item.dueDay
      }
    } else {
      account = {
        id: ID('account', item.key),
        name: item.name,
        type: item.type,
        ownerType: 'HOUSEHOLD',
        balance: item.type === 'CREDIT_CARD' ? 0 : (item.balance ?? 0),
        currency: 'ARS',
        ...(item.type === 'CREDIT_CARD'
          ? { usedAmount: 0, closingDay: item.closingDay, dueDay: item.dueDay }
          : {})
      }
      vault.accounts.push(account)
      const detail =
        item.type === 'CREDIT_CARD'
          ? item.closingDay
            ? ` (cierra el ${item.closingDay}, vence el ${item.dueDay})`
            : ''
          : ` con saldo $${formatArs(account.balance)}`
      report.added.push(`Cuenta "${item.name}"${detail}`)
    }
    accounts.set(item.key, account)
  }

  // Pagos (antes que los movimientos: los movimientos pueden referenciarlos).
  for (const item of data.payments ?? []) {
    const id = ID('payment', item.key)
    if (has(vault.payments, id)) {
      report.skipped.push(`Pago "${item.concept}" (ya estaba)`)
      continue
    }
    const account = accounts.get(item.account)
    const recurring = item.recurring ?? true
    vault.payments.push({
      id,
      concept: item.concept,
      entity: item.entity,
      accountId: account.id,
      ownerType: 'HOUSEHOLD',
      recurring,
      ...(recurring ? { frequency: item.frequency ?? 'MONTHLY' } : {}),
      dueDate: item.dueDate,
      amount: item.amount,
      status: 'PENDING',
      categoryId: resolveCategory(item.category),
      attachments: [],
      kind: 'EXPENSE',
      amountMode: 'FIXED'
    })
    report.added.push(`Pago "${item.concept}" $${formatArs(item.amount)}, vence ${formatDate(item.dueDate)}, con ${account.name}`)
  }

  // Movimientos: se marcan como importados. En una tarjeta, el monto usado suma los consumos
  // nuevos en pesos. En una cuenta no se toca el saldo: el `balance` del archivo ya es el saldo
  // real, que incluye esos movimientos.
  const deltas = new Map()
  for (const item of data.movements ?? []) {
    const id = ID('movement', item.key)
    if (has(vault.movements, id)) {
      report.skipped.push(`Movimiento ${formatDate(item.date)} ${item.note} (ya estaba)`)
      continue
    }
    const account = accounts.get(item.account)
    const type = item.type ?? 'EXPENSE'
    vault.movements.push({
      id,
      type,
      amount: item.amount,
      ...(item.currency ? { currency: item.currency } : {}),
      date: item.date,
      accountId: account.id,
      ...(item.category ? { categoryId: resolveCategory(item.category) } : {}),
      ownerType: 'HOUSEHOLD',
      ...(item.payment ? { paymentId: ID('payment', item.payment) } : {}),
      note: item.note,
      isImported: true
    })
    if (account.type === 'CREDIT_CARD' && (!item.currency || item.currency === 'ARS')) {
      deltas.set(account, (deltas.get(account) ?? 0) + (type === 'INCOME' ? item.amount : -item.amount))
    }
    const sign = type === 'INCOME' ? '+' : '−'
    const amount = item.currency === 'USD' ? `USD ${item.amount}` : `$${formatArs(item.amount)}`
    report.added.push(`Movimiento ${formatDate(item.date)} ${item.note}: ${sign}${amount} en ${account.name}`)
  }
  for (const [account, delta] of deltas) {
    account.usedAmount = Math.max(round2((account.usedAmount ?? 0) - delta), 0)
    report.notes.push(`"${account.name}" queda con $${formatArs(account.usedAmount)} usados (los dólares van aparte).`)
  }

  for (const item of data.debts ?? []) {
    const id = ID('debt', item.key)
    if (has(vault.debts, id)) {
      report.skipped.push(`Deuda "${item.name}" (ya estaba)`)
      continue
    }
    const { key: _key, ...fields } = item
    vault.debts.push({ id, direction: 'OWED_BY_HOUSEHOLD', ownerType: 'HOUSEHOLD', status: 'ACTIVE', ...fields })
    report.added.push(`Deuda "${item.name}" con ${item.counterparty}: debés $${formatArs(item.outstandingBalance)}`)
  }

  for (const item of data.savings ?? []) {
    const id = ID('savings', item.key)
    if (has(vault.savingsInstruments, id)) {
      report.skipped.push(`Inversión "${item.name}" (ya estaba)`)
      continue
    }
    const { key: _key, ...fields } = item
    vault.savingsInstruments.push({ id, ownerType: 'HOUSEHOLD', liquidAnytime: false, ...fields })
    const rate = item.rateAnnual ? ` (${item.rateAnnual}% anual)` : ''
    report.added.push(`Inversión "${item.name}" $${formatArs(item.principal)}${rate}`)
  }

  return report
}

function round2(value) {
  return Math.round(value * 100) / 100
}

function formatArs(value) {
  return value.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatDate(iso) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year.slice(2)}`
}

// ---------------------------------------------------------------------------------------------
// Cifrado (mismo formato VaultEnvelope v1 que la app: PBKDF2-SHA256 + AES-256-GCM)
// ---------------------------------------------------------------------------------------------

const toBase64 = (bytes) => Buffer.from(bytes).toString('base64')
const fromBase64 = (text) => new Uint8Array(Buffer.from(text, 'base64'))

export async function deriveKey(householdKey, salt, iterations) {
  const passwordKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(householdKey), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, passwordKey, 256)
  return crypto.subtle.importKey('raw', bits, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export async function decryptEnvelope(envelope, aesKey) {
  const sealed = new Uint8Array([...fromBase64(envelope.ciphertext), ...fromBase64(envelope.authTag)])
  try {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(envelope.iv), tagLength: 128 }, aesKey, sealed)
    return new TextDecoder().decode(plain)
  } catch {
    throw new Error('La clave del hogar no es correcta.')
  }
}

export async function encryptEnvelope(plainJson, aesKey, envelope) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const sealed = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aesKey, new TextEncoder().encode(plainJson))
  )
  return {
    v: 1,
    kdf: 'pbkdf2',
    iterations: envelope.iterations,
    salt: envelope.salt,
    iv: toBase64(iv),
    authTag: toBase64(sealed.subarray(sealed.length - 16)),
    ciphertext: toBase64(sealed.subarray(0, sealed.length - 16))
  }
}

// ---------------------------------------------------------------------------------------------
// Terminal
// ---------------------------------------------------------------------------------------------

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const stdin = process.stdin
    process.stdout.write(question)
    let answer = ''
    const wasRaw = stdin.isRaw
    if (stdin.isTTY) stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          stdin.removeListener('data', onData)
          if (stdin.isTTY) stdin.setRawMode(wasRaw)
          stdin.pause()
          process.stdout.write('\n')
          resolve(answer)
          return
        }
        if (char === '\u0003') {
          process.stdout.write('\nCancelado.\n')
          process.exit(1)
        }
        if (char === '\u007f' || char === '\b') {
          if (answer.length > 0) {
            answer = answer.slice(0, -1)
            if (!hidden) process.stdout.write('\b \b')
          }
          continue
        }
        answer += char
        process.stdout.write(hidden ? '*' : char)
      }
    }
    stdin.on('data', onData)
  })
}

function readEnv(projectRoot) {
  const env = {}
  const text = readFileSync(path.join(projectRoot, '.env'), 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env')
  }
  return env
}

async function main() {
  const dataPath = process.argv[2]
  if (!dataPath) {
    throw new Error('Pasale el archivo de datos: node scripts/import-to-cloud.mjs ruta/a/datos.json')
  }
  let data
  try {
    data = JSON.parse(readFileSync(dataPath, 'utf8'))
  } catch (error) {
    throw new Error(`No se pudo leer ${dataPath}: ${error.message}`)
  }
  const dataErrors = validateImportData(data)
  if (dataErrors.length > 0) {
    throw new Error(`El archivo de datos tiene errores:\n  - ${dataErrors.join('\n  - ')}`)
  }

  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const env = readEnv(projectRoot)
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  console.log(`\nImportar "${path.basename(dataPath)}" (lote ${data.batch}) a Gastito`)
  console.log('Cerrá la app en el navegador antes de seguir.\n')
  const email = (await ask('Email de la cuenta: ')).trim()
  const password = await ask('Contraseña de la cuenta: ', { hidden: true })

  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({ email, password })
  if (authError || !auth.user) throw new Error(`No se pudo iniciar sesión: ${authError?.message ?? 'sin usuario'}`)
  const userId = auth.user.id

  const { data: row, error: readError } = await supabase
    .from('vaults')
    .select('envelope, version')
    .eq('user_id', userId)
    .maybeSingle()
  if (readError) throw new Error(`No se pudo leer el vault: ${readError.message}`)
  if (!row) throw new Error('Esta cuenta todavía no tiene hogar creado. Entrá primero a la app y creá la clave del hogar.')

  const householdKey = await ask('Clave del hogar: ', { hidden: true })
  console.log('Descifrando (tarda unos segundos)...')
  const aesKey = await deriveKey(householdKey, fromBase64(row.envelope.salt), row.envelope.iterations)
  const vault = JSON.parse(await decryptEnvelope(row.envelope, aesKey))
  for (const listName of ['notifications', 'debts', 'savingsGoals', 'savingsSnapshots', 'categoryRules']) {
    vault[listName] ??= []
  }

  const report = applyImport(vault, data)
  console.log('\nSe va a agregar:')
  for (const line of report.added) console.log(`  + ${line}`)
  if (report.skipped.length > 0) {
    console.log('\nYa estaba (no se toca):')
    for (const line of report.skipped) console.log(`  = ${line}`)
  }
  for (const line of report.notes) console.log(`\n${line}`)

  if (report.added.length === 0) {
    console.log('\nNo hay nada nuevo para agregar.')
    return
  }
  const confirm = normalize(await ask('\n¿Guardar en tu cuenta? (s/n): '))
  if (confirm !== 's' && confirm !== 'si') {
    console.log('No se guardó nada.')
    return
  }

  const backupPath = path.join(projectRoot, `gastito-respaldo-antes-de-importar-${Date.now()}.dat`)
  writeFileSync(backupPath, JSON.stringify(row.envelope))
  console.log(`Respaldo del estado anterior: ${backupPath}`)

  const envelope = await encryptEnvelope(JSON.stringify(vault), aesKey, row.envelope)
  const { data: saved, error: saveError } = await supabase
    .from('vaults')
    .update({ envelope, version: row.version + 1 })
    .eq('user_id', userId)
    .eq('version', row.version)
    .select('version')
  if (saveError) throw new Error(`No se pudo guardar: ${saveError.message}`)
  if (!saved || saved.length === 0) {
    throw new Error('Otro dispositivo guardó cambios mientras tanto. No se guardó nada: cerrá la app y volvé a correr el script.')
  }
  await supabase.auth.signOut()
  console.log('\nListo. Abrí la app y entrá con tu cuenta para verlo.')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`\nError: ${error.message}`)
    process.exit(1)
  })
}

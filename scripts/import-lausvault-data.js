#!/usr/bin/env node
'use strict'

/**
 * Importador puntual: carga los datos exportados de LausVault (cuentas, gastos
 * fijos y movimientos) en el vault.dat real de Mi Hogar.
 *
 * Corré esto en TU terminal. La contraseña del vault se pide acá mismo y
 * nunca se envía a ningún lado. Hace un backup (vault.dat.bak.import) antes
 * de escribir nada, y es idempotente: si lo corrés dos veces no duplica
 * cuentas/pagos/movimientos ya cargados.
 *
 * Uso:
 *   node scripts/import-lausvault-data.js            # pide confirmación
 *   node scripts/import-lausvault-data.js --dry-run   # solo muestra qué haría
 */

const { readFile, writeFile, copyFile, rename } = require('fs/promises')
const { existsSync } = require('fs')
const { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes, randomUUID } = require('crypto')
const os = require('os')
const path = require('path')
const readline = require('readline')

const DRY_RUN = process.argv.includes('--dry-run')

const VAULT_PATH =
  process.env.VAULT_PATH || path.join(os.homedir(), '.config', 'mi-hogar', 'vault.dat')
const BACKUP_PATH = `${VAULT_PATH}.bak.import`
const TEMP_PATH = `${VAULT_PATH}.tmp.import`

const PBKDF2_ITERATIONS = 600_000
const KEY_LENGTH_BYTES = 32
const IV_LENGTH_BYTES = 12

// ---------------------------------------------------------------------------
// Datos de origen (Export Economía — LausVault, al 2026-09-15)
// ---------------------------------------------------------------------------

const TODAY = '2026-09-15'

const ACCOUNTS_DATA = [
  { key: 'tarjeta', name: 'Tarjeta', type: 'CREDIT_CARD', balance: 0, closingDay: 27, dueDay: 4 },
  { key: 'banco', name: 'Banco Galicia, caja 1', type: 'BANK', balance: 135184.47 },
  { key: 'mp', name: 'Mercado Pago', type: 'CASH', balance: 700 }
]

const CATEGORY_MAP = {
  alquiler: 'Alquiler o vivienda',
  supermercado: 'Súper',
  transporte: 'Transporte',
  salidas: 'Salidas',
  servicios: 'Servicios',
  salud: 'Salud',
  otros: 'Otros gastos'
}

const PAYMENTS_DATA = [
  {
    key: 'personal',
    concept: 'Personal (celular)',
    entity: 'Personal',
    amount: 41296.95,
    day: 11,
    categoryKey: 'servicios',
    accountKey: 'tarjeta'
  },
  {
    key: 'claud',
    concept: 'Claud (Anthropic)',
    entity: 'Anthropic',
    amount: 29400,
    day: 14,
    categoryKey: 'servicios',
    accountKey: 'tarjeta'
  },
  {
    key: 'osdepym',
    concept: 'OSDEPYM',
    entity: 'OSDEPYM',
    amount: 19146.37,
    day: 20,
    categoryKey: 'servicios',
    accountKey: 'tarjeta'
  },
  {
    key: 'classic',
    concept: 'Servicio Cuenta Classic',
    entity: 'Banco Galicia',
    amount: 23719.01,
    day: 7,
    categoryKey: 'servicios',
    accountKey: 'tarjeta'
  }
]

// type: EXPENSE | INCOME | TRANSFER
const MOVEMENTS_DATA = [
  { date: '2026-07-30', type: 'EXPENSE', amount: 9100, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-07-30', type: 'EXPENSE', amount: 600432.87, accountKey: 'tarjeta', categoryKey: 'otros', note: 'Saldo anterior de tarjeta (neto de pago del 11/08)' },
  { date: '2026-08-01', type: 'EXPENSE', amount: 27000, accountKey: 'tarjeta', categoryKey: 'salidas', note: 'MERPAGO*BARRA1' },
  { date: '2026-08-03', type: 'EXPENSE', amount: 7800, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-04', type: 'EXPENSE', amount: 5000, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-07', type: 'EXPENSE', amount: 8400, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*LINFENG' },
  { date: '2026-08-07', type: 'EXPENSE', amount: 23719.01, accountKey: 'tarjeta', categoryKey: 'servicios', note: 'SERVICIO CUENTA CLASSIC (fijo)', paymentKey: 'classic' },
  { date: '2026-08-08', type: 'EXPENSE', amount: 34400, accountKey: 'tarjeta', categoryKey: 'salidas', note: 'ANTOLINA-SUCURSAL PADUA' },
  { date: '2026-08-08', type: 'EXPENSE', amount: 38000, accountKey: 'tarjeta', categoryKey: 'salidas', note: 'CINEPOLIS MERLO' },
  { date: '2026-08-09', type: 'EXPENSE', amount: 11493.79, accountKey: 'tarjeta', categoryKey: 'servicios', note: 'DLO*PRIMEVIDEO' },
  { date: '2026-08-11', type: 'EXPENSE', amount: 41296.95, accountKey: 'tarjeta', categoryKey: 'servicios', note: 'PERSONAL (fijo)', paymentKey: 'personal' },
  { date: '2026-08-11', type: 'EXPENSE', amount: 20200, accountKey: 'tarjeta', categoryKey: 'otros', note: 'RSI*ZUREN ZHOU (sin categorizar)' },
  { date: '2026-08-11', type: 'EXPENSE', amount: 32200, accountKey: 'tarjeta', categoryKey: 'otros', note: 'RSI*ZUREN ZHOU (sin categorizar)' },
  { date: '2026-08-12', type: 'EXPENSE', amount: 4700, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-13', type: 'EXPENSE', amount: 7800, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-14', type: 'EXPENSE', amount: 5100, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'PVS*SUPERMERCADO PROSPERO' },
  { date: '2026-08-14', type: 'EXPENSE', amount: 29400, accountKey: 'tarjeta', categoryKey: 'servicios', note: 'ANTHROPIC*CLAUD (fijo, US$20 x $1470)', paymentKey: 'claud' },
  { date: '2026-08-15', type: 'EXPENSE', amount: 8200, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-16', type: 'EXPENSE', amount: 15000, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-17', type: 'EXPENSE', amount: 10900, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-19', type: 'EXPENSE', amount: 9700, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-20', type: 'EXPENSE', amount: 19146.37, accountKey: 'tarjeta', categoryKey: 'servicios', note: 'MERPAGO*OSDEPYM (fijo)', paymentKey: 'osdepym' },
  { date: '2026-08-22', type: 'EXPENSE', amount: 42900, accountKey: 'tarjeta', categoryKey: 'salidas', note: 'MERPAGO*OBERONCASATE' },
  { date: '2026-08-25', type: 'EXPENSE', amount: 10800, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'MERPAGO*FENGZHUCHEN' },
  { date: '2026-08-26', type: 'EXPENSE', amount: 64984.85, accountKey: 'tarjeta', categoryKey: 'otros', note: 'Impuestos e intereses del resumen (sellos, IVA, RG5617, financiación)' },
  { date: '2026-08-27', type: 'EXPENSE', amount: 9700, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'Mercado (27/08, ciclo siguiente)' },
  { date: '2026-08-28', type: 'EXPENSE', amount: 33000, accountKey: 'tarjeta', categoryKey: 'salud', note: 'corte de pelo/rodriguez estilista' },
  { date: '2026-08-29', type: 'EXPENSE', amount: 5900, accountKey: 'tarjeta', categoryKey: 'supermercado' },
  { date: '2026-08-29', type: 'EXPENSE', amount: 17800, accountKey: 'tarjeta', categoryKey: 'salidas' },
  { date: '2026-08-29', type: 'EXPENSE', amount: 54400, accountKey: 'tarjeta', categoryKey: 'salidas' },
  { date: '2026-08-31', type: 'INCOME', amount: 218030, accountKey: 'banco', note: 'Ingreso por horas (18.54h x US$8 x $1470)' },
  { date: '2026-08-31', type: 'INCOME', amount: 147000, accountKey: 'banco', note: 'regalo tio' },
  { date: '2026-08-31', type: 'EXPENSE', amount: 6400, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'Mercado' },
  { date: '2026-09-02', type: 'EXPENSE', amount: 9500, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'Mercado' },
  { date: '2026-09-04', type: 'TRANSFER', amount: 200445.53, accountKey: 'banco', toAccountKey: 'tarjeta', note: 'Pago resumen tarjeta mes anterior (ARS)' },
  { date: '2026-09-04', type: 'TRANSFER', amount: 29400, accountKey: 'banco', toAccountKey: 'tarjeta', note: 'Pago resumen tarjeta mes anterior (USD 20 x $1470)' },
  { date: '2026-09-06', type: 'EXPENSE', amount: 31900, accountKey: 'tarjeta', categoryKey: 'salidas', note: 'Salida' },
  { date: '2026-09-07', type: 'EXPENSE', amount: 8800, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'Mercado' },
  { date: '2026-09-08', type: 'EXPENSE', amount: 25630, accountKey: 'tarjeta', categoryKey: 'otros', note: 'mascotas' },
  { date: '2026-09-09', type: 'EXPENSE', amount: 9300, accountKey: 'tarjeta', categoryKey: 'supermercado' },
  { date: '2026-09-10', type: 'EXPENSE', amount: 12400, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'mercado' },
  { date: '2026-09-11', type: 'EXPENSE', amount: 5500, accountKey: 'tarjeta', categoryKey: 'supermercado', note: 'Mercado' }
]

// Nota: no hay "horas trabajadas" ni "recibos" en el modelo de Mi Hogar; se
// omiten por decisión del usuario. El ingreso de $218.030 por horas se carga
// como un movimiento de tipo income normal (arriba), con la nota original.

// ---------------------------------------------------------------------------
// Crypto (misma implementación que electron/main/crypto/*.ts)
// ---------------------------------------------------------------------------

function deriveKey(householdKey, salt, iterations) {
  return pbkdf2Sync(householdKey, salt, iterations, KEY_LENGTH_BYTES, 'sha256')
}

function encryptVault(plainJson, key, salt) {
  const iv = randomBytes(IV_LENGTH_BYTES)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(plainJson, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return {
    v: 1,
    kdf: 'pbkdf2',
    iterations: PBKDF2_ITERATIONS,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: ciphertext.toString('base64')
  }
}

function decryptVault(envelope, key) {
  const iv = Buffer.from(envelope.iv, 'base64')
  const authTag = Buffer.from(envelope.authTag, 'base64')
  const ciphertext = Buffer.from(envelope.ciphertext, 'base64')
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return plain.toString('utf8')
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

function promptHidden(promptText) {
  return new Promise((resolve) => {
    process.stdout.write(promptText)
    const stdin = process.stdin
    stdin.resume()
    stdin.setEncoding('utf8')
    const wasRaw = stdin.isRaw
    if (stdin.setRawMode) stdin.setRawMode(true)
    let input = ''
    let done = false
    const onData = (chunk) => {
      const chars = chunk.toString()
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i]
        if (done) return
        if (char === '\n' || char === '\r' || char === '\u0004') {
          done = true
          cleanup()
          const rest = chars.slice(i + 1)
          if (rest) stdin.unshift(rest)
          process.stdout.write('\n')
          resolve(input)
          return
        }
        if (char === '\u0003') {
          cleanup()
          process.stdout.write('\n')
          process.exit(1)
        }
        if (char === '\u007f' || char === '\b') {
          if (input.length > 0) {
            input = input.slice(0, -1)
            process.stdout.write('\b \b')
          }
          continue
        }
        input += char
        process.stdout.write('*')
      }
    }
    function cleanup() {
      stdin.removeListener('data', onData)
      if (stdin.setRawMode) stdin.setRawMode(wasRaw)
      stdin.pause()
    }
    stdin.on('data', onData)
  })
}

function promptConfirm(promptText) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(promptText, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase() === 's' || answer.trim().toLowerCase() === 'si')
    })
  })
}

// ---------------------------------------------------------------------------
// Helpers de mapeo
// ---------------------------------------------------------------------------

function computeNextDueDate(day, todayIso) {
  const [y, m, d] = todayIso.split('-').map(Number)
  let year = y
  let month = m
  if (d > day) {
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function pickOwner(vault) {
  if (Array.isArray(vault.members) && vault.members.length === 1) {
    return { ownerType: 'MEMBER', ownerId: vault.members[0].id }
  }
  return { ownerType: 'HOUSEHOLD' }
}

function findOrCreateCategory(vault, name, kind, created) {
  const existing = vault.categories.find(
    (c) => c.kind === kind && c.name.trim().toLowerCase() === name.trim().toLowerCase()
  )
  if (existing) return existing.id
  const category = { id: randomUUID(), name, kind }
  vault.categories.push(category)
  created.push(name)
  return category.id
}

function findOrCreateAccount(vault, data, owner, created) {
  const existing = vault.accounts.find((a) => a.name.trim().toLowerCase() === data.name.trim().toLowerCase())
  if (existing) return existing.id
  const account = {
    id: randomUUID(),
    name: data.name,
    type: data.type,
    balance: data.balance,
    ...owner,
    ...(data.closingDay ? { closingDay: data.closingDay } : {}),
    ...(data.dueDay ? { dueDay: data.dueDay } : {})
  }
  vault.accounts.push(account)
  created.push(account.name)
  return account.id
}

function findOrCreatePayment(vault, data, accountId, categoryId, owner, created) {
  const existing = vault.payments.find((p) => p.concept.trim().toLowerCase() === data.concept.trim().toLowerCase())
  if (existing) return existing.id
  const payment = {
    id: randomUUID(),
    concept: data.concept,
    entity: data.entity,
    accountId,
    ...owner,
    recurring: true,
    frequency: 'MONTHLY',
    dueDate: computeNextDueDate(data.day, TODAY),
    amount: data.amount,
    status: 'PENDING',
    categoryId,
    attachments: []
  }
  vault.payments.push(payment)
  created.push(payment.concept)
  return payment.id
}

function movementExists(vault, movement) {
  return vault.movements.some(
    (m) =>
      m.date === movement.date &&
      m.amount === movement.amount &&
      m.accountId === movement.accountId &&
      m.type === movement.type &&
      (m.note || '') === (movement.note || '')
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!existsSync(VAULT_PATH)) {
    console.error(`No encontré el vault en ${VAULT_PATH}. Seteá VAULT_PATH si está en otro lado.`)
    process.exit(1)
  }

  console.log(`Vault: ${VAULT_PATH}${DRY_RUN ? '  (--dry-run, no se escribe nada)' : ''}`)
  const password = await promptHidden('Contraseña del vault: ')

  const envelope = JSON.parse(await readFile(VAULT_PATH, 'utf8'))
  const key = deriveKey(password, Buffer.from(envelope.salt, 'base64'), envelope.iterations || PBKDF2_ITERATIONS)

  let plainJson
  try {
    plainJson = decryptVault(envelope, key)
  } catch {
    console.error('Contraseña incorrecta o archivo dañado. No se modificó nada.')
    process.exit(1)
  }

  const vault = JSON.parse(plainJson)
  if (vault.version !== 1) {
    console.error(`Versión de vault inesperada (${vault.version}). Abortando por seguridad.`)
    process.exit(1)
  }

  const owner = pickOwner(vault)
  const createdCategories = []
  const createdAccounts = []
  const createdPayments = []

  const accountIdByKey = {}
  for (const data of ACCOUNTS_DATA) {
    accountIdByKey[data.key] = findOrCreateAccount(vault, data, owner, createdAccounts)
  }

  const categoryIdByKey = {}
  for (const [key, name] of Object.entries(CATEGORY_MAP)) {
    categoryIdByKey[key] = findOrCreateCategory(vault, name, 'EXPENSE', createdCategories)
  }

  const paymentIdByKey = {}
  for (const data of PAYMENTS_DATA) {
    paymentIdByKey[data.key] = findOrCreatePayment(
      vault,
      data,
      accountIdByKey[data.accountKey],
      categoryIdByKey[data.categoryKey],
      owner,
      createdPayments
    )
  }

  let addedMovements = 0
  let skippedMovements = 0
  for (const data of MOVEMENTS_DATA) {
    const movement = {
      id: randomUUID(),
      type: data.type,
      amount: data.amount,
      date: data.date,
      accountId: accountIdByKey[data.accountKey],
      ...(data.toAccountKey ? { toAccountId: accountIdByKey[data.toAccountKey] } : {}),
      ...(data.categoryKey ? { categoryId: categoryIdByKey[data.categoryKey] } : {}),
      ...owner,
      ...(data.paymentKey ? { paymentId: paymentIdByKey[data.paymentKey] } : {}),
      ...(data.note ? { note: data.note } : {})
    }
    if (movementExists(vault, movement)) {
      skippedMovements += 1
      continue
    }
    vault.movements.push(movement)
    addedMovements += 1
  }

  console.log('\nResumen:')
  console.log(`  Cuentas nuevas: ${createdAccounts.length ? createdAccounts.join(', ') : '(ninguna, ya existían)'}`)
  console.log(`  Categorías nuevas: ${createdCategories.length ? createdCategories.join(', ') : '(ninguna, ya existían)'}`)
  console.log(`  Gastos fijos nuevos: ${createdPayments.length ? createdPayments.join(', ') : '(ninguno, ya existían)'}`)
  console.log(`  Movimientos: ${addedMovements} nuevos, ${skippedMovements} ya existentes (omitidos)`)
  console.log(`  Owner asignado: ${owner.ownerType}${owner.ownerId ? ' / ' + owner.ownerId : ''}`)

  if (DRY_RUN) {
    console.log('\n--dry-run: no se escribió nada.')
    return
  }

  if (addedMovements === 0 && createdAccounts.length === 0 && createdPayments.length === 0) {
    console.log('\nNada para agregar (todo ya estaba cargado). No se toca el vault.')
    return
  }

  const confirmed = await promptConfirm('\n¿Escribir estos cambios en el vault? (s/N) ')
  if (!confirmed) {
    console.log('Cancelado. No se modificó nada.')
    return
  }

  const newEnvelope = encryptVault(JSON.stringify(vault), key, Buffer.from(envelope.salt, 'base64'))

  if (existsSync(VAULT_PATH)) {
    await copyFile(VAULT_PATH, BACKUP_PATH)
  }
  await writeFile(TEMP_PATH, JSON.stringify(newEnvelope), 'utf8')
  await rename(TEMP_PATH, VAULT_PATH)

  console.log(`\nListo. Backup previo guardado en ${BACKUP_PATH}`)
  console.log('Abrí la app normalmente (si estaba abierta, cerrala y volvé a abrirla antes de tocar nada).')
}

main().catch((err) => {
  console.error('Error inesperado:', err.message)
  process.exit(1)
})

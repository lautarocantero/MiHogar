#!/usr/bin/env node
'use strict'

/**
 * Importador puntual: agrega a los "pagos fijos" (Payments) las compras en
 * cuotas encontradas en el resumen de tarjeta Visa Galicia de agosto 2026
 * (Resumen N° VI00000000005151992, cierre 27-Ago-26, vencimiento 04-Sep-26).
 *
 * Alcance: SOLO agrega pagos fijos. No toca cuentas, movimientos ni nada
 * más. Busca la cuenta "Tarjeta" ya existente en el vault (la que cargó
 * import-lausvault-data.js) — si no la encuentra, aborta sin escribir nada.
 *
 * El resumen no tiene un campo estructurado de "fecha de fin de cuotas": se
 * calculó a mano a partir de la columna CUOTA (n/total) de cada consumo y
 * del ciclo de facturación del resumen (vencimiento actual 04-Sep-26,
 * próximo vencimiento 09-Oct-26 — dato exacto tomado del PDF). Para meses
 * más allá del próximo vencimiento no hay fecha exacta informada por el
 * banco, así que se proyectó usando el mismo día (09) de cada mes
 * siguiente. La fecha de fin queda anotada en el concepto de cada pago
 * para que quede visible en la app aunque el modelo de datos no tenga un
 * campo dedicado para "cuotas restantes" en Pagos.
 *
 * Corré esto en TU terminal. La contraseña del vault se pide acá mismo y
 * nunca se envía a ningún lado. Hace un backup (vault.dat.bak.import) antes
 * de escribir nada, y es idempotente: si lo corrés dos veces no duplica los
 * pagos ya cargados (los identifica por concepto).
 *
 * Uso:
 *   node scripts/import-visa-cuotas.js            # pide confirmación
 *   node scripts/import-visa-cuotas.js --dry-run   # solo muestra qué haría
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

const ACCOUNT_NAME = 'Tarjeta'

// ---------------------------------------------------------------------------
// Datos de origen (Resumen VISA Galicia, agosto 2026 — parseado del PDF)
// ---------------------------------------------------------------------------
//
// DETALLE DEL CONSUMO del resumen: de todas las líneas, solo dos tienen algo
// cargado en la columna CUOTA (el resto es "en un pago"):
//   29-03-26  122586*MOVISTAR ARENA        cuota 05/06   $43.333,33
//   14-06-26  MERPAGO*ARGENTRADE           cuota 03/18   $57.502,66
//
// Ciclo de facturación de este resumen: cierre actual 27-Ago-26, vencimiento
// actual 04-Sep-26, próximo cierre 01-Oct-26, próximo vencimiento 09-Oct-26
// (estos dos últimos SÍ figuran exactos en el PDF). La próxima cuota de
// ambos consumos cae en el próximo resumen, o sea vence el 09-Oct-26.

const CUOTAS_DATA = [
  {
    concept: 'Movistar Arena (cuota 6/6 — última cuota)',
    entity: 'Movistar Arena',
    amount: 43333.33,
    // Cuota 5/6 ya está en el resumen de agosto (pagada al pagar este
    // resumen); la 6/6 es la última que falta, vence con el próximo
    // resumen.
    dueDate: '2026-10-09',
    recurring: false,
    frequency: undefined,
    categoryName: 'Salidas'
  },
  {
    concept: 'Mercado Pago * Argentrade (cuota 4/18 de 18 — finaliza dic/2027)',
    entity: 'Argentrade',
    amount: 57502.66,
    // Cuota 3/18 ya está en el resumen de agosto; quedan 15 cuotas más
    // (4 a 18). La 4/18 vence con el próximo resumen; la última (18/18)
    // cae ~14 meses después, alrededor de diciembre 2027 (proyectado, el
    // banco no informa fecha exacta para meses tan lejanos).
    dueDate: '2026-10-09',
    recurring: true,
    frequency: 'MONTHLY',
    categoryName: 'Otros gastos'
  }
]

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
        if (char === '\n' || char === '\r' || char === '') {
          done = true
          cleanup()
          const rest = chars.slice(i + 1)
          if (rest) stdin.unshift(rest)
          process.stdout.write('\n')
          resolve(input)
          return
        }
        if (char === '') {
          cleanup()
          process.stdout.write('\n')
          process.exit(1)
        }
        if (char === '' || char === '\b') {
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

function pickOwner(vault) {
  if (Array.isArray(vault.members) && vault.members.length === 1) {
    return { ownerType: 'MEMBER', ownerId: vault.members[0].id }
  }
  return { ownerType: 'HOUSEHOLD' }
}

function findCategoryId(vault, name) {
  const existing = vault.categories.find(
    (c) => c.kind === 'EXPENSE' && c.name.trim().toLowerCase() === name.trim().toLowerCase()
  )
  return existing ? existing.id : null
}

function findPayment(vault, concept) {
  return vault.payments.find((p) => p.concept.trim().toLowerCase() === concept.trim().toLowerCase())
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
  const key = deriveKey(
    password,
    Buffer.from(envelope.salt, 'base64'),
    envelope.iterations || PBKDF2_ITERATIONS
  )

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

  const account = vault.accounts.find(
    (a) => a.name.trim().toLowerCase() === ACCOUNT_NAME.trim().toLowerCase()
  )
  if (!account) {
    console.error(
      `No encontré ninguna cuenta llamada "${ACCOUNT_NAME}" en el vault. ` +
        'Este script solo agrega pagos fijos — no crea cuentas. Corré primero ' +
        'import-lausvault-data.js (que crea la cuenta "Tarjeta"), o creála a mano ' +
        'en la app, y volvé a correr esto.'
    )
    process.exit(1)
  }

  const owner = pickOwner(vault)
  const createdPayments = []
  const skippedPayments = []

  for (const data of CUOTAS_DATA) {
    if (findPayment(vault, data.concept)) {
      skippedPayments.push(data.concept)
      continue
    }
    const categoryId = findCategoryId(vault, data.categoryName)
    if (!categoryId) {
      console.error(
        `No encontré la categoría "${data.categoryName}" en el vault. Abortando sin escribir nada.`
      )
      process.exit(1)
    }
    const payment = {
      id: randomUUID(),
      concept: data.concept,
      entity: data.entity,
      accountId: account.id,
      ...owner,
      recurring: data.recurring,
      ...(data.recurring ? { frequency: data.frequency } : {}),
      dueDate: data.dueDate,
      amount: data.amount,
      status: 'PENDING',
      categoryId,
      attachments: []
    }
    vault.payments.push(payment)
    createdPayments.push(data.concept)
  }

  console.log('\nResumen:')
  console.log(`  Cuenta usada: ${account.name} (${account.id})`)
  console.log(
    `  Pagos fijos nuevos: ${createdPayments.length ? createdPayments.join(' | ') : '(ninguno)'}`
  )
  console.log(
    `  Pagos ya existentes (omitidos): ${skippedPayments.length ? skippedPayments.join(' | ') : '(ninguno)'}`
  )
  console.log(`  Owner asignado: ${owner.ownerType}${owner.ownerId ? ' / ' + owner.ownerId : ''}`)

  if (DRY_RUN) {
    console.log('\n--dry-run: no se escribió nada.')
    return
  }

  if (createdPayments.length === 0) {
    console.log('\nNada para agregar (ya estaba todo cargado). No se toca el vault.')
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
  console.log(
    'Abrí la app normalmente (si estaba abierta, cerrala y volvé a abrirla antes de tocar nada).'
  )
}

main().catch((err) => {
  console.error('Error inesperado:', err.message)
  process.exit(1)
})

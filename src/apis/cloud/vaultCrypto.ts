import type { VaultEnvelope } from '@shared/vaultEnvelope.types'
import { AppError, InvalidBackupFileError, InvalidHouseholdKeyError } from './errors'

/**
 * Cifrado del vault con WebCrypto, byte a byte compatible con la versión de Node que
 * usaba la app de escritorio (`VaultEnvelope` v1):
 * - PBKDF2-SHA256, 600.000 iteraciones, clave de 32 bytes, salt de 16 bytes.
 * - AES-256-GCM, IV de 12 bytes, authTag de 16 bytes guardado APARTE del ciphertext.
 *   WebCrypto devuelve `ciphertext || tag`, así que se separa al cifrar y se vuelve a
 *   unir al descifrar.
 */
/** Bytes sobre un ArrayBuffer común (lo que aceptan WebCrypto y Blob). */
export type Bytes = Uint8Array<ArrayBuffer>

export const PBKDF2_ITERATIONS = 600_000
const KEY_LENGTH_BITS = 256
const SALT_LENGTH_BYTES = 16
const IV_LENGTH_BYTES = 12
const AUTH_TAG_LENGTH_BYTES = 16
const AUTH_TAG_LENGTH_BITS = AUTH_TAG_LENGTH_BYTES * 8
/** Bytes que el cifrado agrega a cada adjunto subido (IV + authTag). */
export const ATTACHMENT_ENCRYPTION_OVERHEAD_BYTES = IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES
// Límites para no aceptar un respaldo manipulado que fuerce una derivación trivial o
// que congele la pestaña.
const MIN_ITERATIONS = 100_000
const MAX_ITERATIONS = 5_000_000

function getSubtle(): SubtleCrypto {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new AppError('vaultErrors.cryptoUnavailable')
  }
  return subtle
}

// --- base64 ---------------------------------------------------------------------------

export function bytesToBase64(bytes: Bytes): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

export function base64ToBytes(base64: string): Bytes {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function concatBytes(first: Bytes, second: Bytes): Bytes {
  const joined = new Uint8Array(first.length + second.length)
  joined.set(first, 0)
  joined.set(second, first.length)
  return joined
}

// --- comparación ----------------------------------------------------------------------

/** Compara sin cortar en el primer byte distinto (tiempo constante para igual largo). */
export function constantTimeEqual(first: Bytes, second: Bytes): boolean {
  if (first.length !== second.length) return false
  let difference = 0
  for (let index = 0; index < first.length; index += 1) {
    difference |= first[index] ^ second[index]
  }
  return difference === 0
}

// --- derivación -----------------------------------------------------------------------

export type DerivedVaultKey = {
  aesKey: CryptoKey
  /** SHA-256 de la clave derivada: permite verificar la clave sin guardar sus bytes. */
  fingerprint: Bytes
}

export function generateSalt(): Bytes {
  return globalThis.crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES))
}

export async function deriveVaultKey(
  householdKey: string,
  salt: Bytes,
  iterations: number = PBKDF2_ITERATIONS
): Promise<DerivedVaultKey> {
  const subtle = getSubtle()
  const passwordKey = await subtle.importKey(
    'raw',
    new TextEncoder().encode(householdKey),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = new Uint8Array(
    await subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
      passwordKey,
      KEY_LENGTH_BITS
    )
  )
  try {
    const aesKey = await subtle.importKey('raw', bits, { name: 'AES-GCM' }, false, [
      'encrypt',
      'decrypt'
    ])
    const fingerprint = new Uint8Array(await subtle.digest('SHA-256', bits))
    return { aesKey, fingerprint }
  } finally {
    bits.fill(0)
  }
}

// --- envelope -------------------------------------------------------------------------

export async function encryptVaultJson(
  plainJson: string,
  aesKey: CryptoKey,
  salt: Bytes,
  iterations: number = PBKDF2_ITERATIONS
): Promise<VaultEnvelope> {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES))
  const sealed = new Uint8Array(
    await getSubtle().encrypt(
      { name: 'AES-GCM', iv, tagLength: AUTH_TAG_LENGTH_BITS },
      aesKey,
      new TextEncoder().encode(plainJson)
    )
  )
  const ciphertext = sealed.subarray(0, sealed.length - AUTH_TAG_LENGTH_BYTES)
  const authTag = sealed.subarray(sealed.length - AUTH_TAG_LENGTH_BYTES)

  return {
    v: 1,
    kdf: 'pbkdf2',
    iterations,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    authTag: bytesToBase64(authTag),
    ciphertext: bytesToBase64(ciphertext)
  }
}

export async function decryptVaultEnvelope(
  envelope: VaultEnvelope,
  aesKey: CryptoKey
): Promise<string> {
  try {
    const iv = base64ToBytes(envelope.iv)
    const sealed = concatBytes(base64ToBytes(envelope.ciphertext), base64ToBytes(envelope.authTag))
    const plain = await getSubtle().decrypt(
      { name: 'AES-GCM', iv, tagLength: AUTH_TAG_LENGTH_BITS },
      aesKey,
      sealed
    )
    return new TextDecoder().decode(plain)
  } catch {
    throw new InvalidHouseholdKeyError()
  }
}

// Base64 estándar con padding (lo que generan Node y `btoa`): `atob` acepta más cosas
// (espacios, sin padding) y no se quiere aceptar un envelope "casi" válido.
const STRICT_BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

function isBase64OfLength(value: unknown, expectedLength?: number): boolean {
  if (typeof value !== 'string' || value.length === 0 || !STRICT_BASE64.test(value)) return false
  try {
    const bytes = base64ToBytes(value)
    return expectedLength === undefined || bytes.length === expectedLength
  } catch {
    return false
  }
}

export function isVaultEnvelope(value: unknown): value is VaultEnvelope {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    candidate.v === 1 &&
    candidate.kdf === 'pbkdf2' &&
    typeof candidate.iterations === 'number' &&
    Number.isInteger(candidate.iterations) &&
    candidate.iterations >= MIN_ITERATIONS &&
    candidate.iterations <= MAX_ITERATIONS &&
    isBase64OfLength(candidate.salt, SALT_LENGTH_BYTES) &&
    isBase64OfLength(candidate.iv, IV_LENGTH_BYTES) &&
    isBase64OfLength(candidate.authTag, AUTH_TAG_LENGTH_BYTES) &&
    isBase64OfLength(candidate.ciphertext)
  )
}

/** Valida el contenido de un `.dat` y devuelve solo los campos del envelope. */
export function parseVaultEnvelope(raw: string): VaultEnvelope {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new InvalidBackupFileError()
  }
  if (!isVaultEnvelope(parsed)) {
    throw new InvalidBackupFileError()
  }
  const { v, kdf, iterations, salt, iv, authTag, ciphertext } = parsed
  return { v, kdf, iterations, salt, iv, authTag, ciphertext }
}

// --- adjuntos -------------------------------------------------------------------------

/**
 * Cada adjunto se cifra con una clave AES-256-GCM aleatoria propia. La clave queda en
 * la metadata del adjunto, dentro del vault (cifrado con la clave del hogar): así
 * cambiar la clave del hogar no obliga a recifrar los archivos ya subidos.
 * Formato del objeto subido: `iv (12 bytes) || ciphertext || authTag (16 bytes)`.
 */
export async function encryptAttachmentBytes(
  plainBytes: Bytes
): Promise<{ payload: Bytes; keyBase64: string }> {
  const subtle = getSubtle()
  const key = await subtle.generateKey({ name: 'AES-GCM', length: KEY_LENGTH_BITS }, true, [
    'encrypt',
    'decrypt'
  ])
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES))
  const sealed = new Uint8Array(
    await subtle.encrypt({ name: 'AES-GCM', iv, tagLength: AUTH_TAG_LENGTH_BITS }, key, plainBytes)
  )
  const rawKey = new Uint8Array(await subtle.exportKey('raw', key))
  const keyBase64 = bytesToBase64(rawKey)
  rawKey.fill(0)
  return { payload: concatBytes(iv, sealed), keyBase64 }
}

export async function decryptAttachmentBytes(payload: Bytes, keyBase64: string): Promise<Bytes> {
  if (payload.length < IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES) {
    throw new AppError('attachments.errors.corrupted')
  }
  const subtle = getSubtle()
  let rawKey: Bytes | null = null
  try {
    rawKey = base64ToBytes(keyBase64)
    const key = await subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt'])
    const plain = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: payload.subarray(0, IV_LENGTH_BYTES),
        tagLength: AUTH_TAG_LENGTH_BITS
      },
      key,
      payload.subarray(IV_LENGTH_BYTES)
    )
    return new Uint8Array(plain)
  } catch {
    throw new AppError('attachments.errors.corrupted')
  } finally {
    rawKey?.fill(0)
  }
}

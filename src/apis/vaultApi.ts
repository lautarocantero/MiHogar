import type { VaultEnvelope } from '@shared/vaultEnvelope.types'
import { getSupabase } from './cloud/supabaseClient'
import { requireCurrentUserId } from './authApi'
import {
  InvalidBackupFileError,
  InvalidHouseholdKeyError,
  VaultAlreadyExistsError,
  VaultConflictError,
  VaultNotFoundError,
  toCloudError
} from './cloud/errors'
import {
  base64ToBytes,
  bytesToBase64,
  constantTimeEqual,
  decryptVaultEnvelope,
  deriveVaultKey,
  encryptVaultJson,
  generateSalt,
  isVaultEnvelope,
  parseVaultEnvelope,
  PBKDF2_ITERATIONS
} from './cloud/vaultCrypto'
import type { Bytes } from './cloud/vaultCrypto'
import {
  clearVaultSession,
  getVaultSession,
  requireVaultSession,
  setVaultSession
} from './cloud/vaultSession'
import { downloadBlob, pickFile } from './cloud/browserFiles'

/**
 * Vault en la nube: una fila por usuario en `vaults` con el `VaultEnvelope` cifrado en
 * el cliente. El servidor nunca ve la clave del hogar ni los datos en claro.
 */
const VAULTS_TABLE = 'vaults'
const UNIQUE_VIOLATION = '23505'
const BACKUP_FILE_NAME = 'gastito-respaldo.dat'
const MAX_BACKUP_FILE_BYTES = 20 * 1024 * 1024

export type RemoteVault = {
  envelope: VaultEnvelope
  version: number
}

function parseJson(plainJson: string): unknown {
  try {
    return JSON.parse(plainJson)
  } catch {
    throw new InvalidHouseholdKeyError()
  }
}

async function fetchRemoteVaultForUser(userId: string): Promise<RemoteVault | null> {
  const { data, error } = await getSupabase()
    .from(VAULTS_TABLE)
    .select('envelope, version')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw toCloudError(error)
  if (!data) return null
  if (!isVaultEnvelope(data.envelope)) throw new VaultNotFoundError()
  return { envelope: data.envelope, version: data.version }
}

/** Deriva la clave desde el envelope, descifra y deja la sesión abierta. */
async function openEnvelope(
  userId: string,
  envelope: VaultEnvelope,
  householdKey: string,
  version: number
): Promise<unknown> {
  const salt = base64ToBytes(envelope.salt)
  const { aesKey, fingerprint } = await deriveVaultKey(householdKey, salt, envelope.iterations)
  const vaultJson = parseJson(await decryptVaultEnvelope(envelope, aesKey))
  setVaultSession({ userId, aesKey, fingerprint, salt, iterations: envelope.iterations, version })
  return vaultJson
}

async function fetchVersionForUser(userId: string): Promise<number | null> {
  const { data, error } = await getSupabase()
    .from(VAULTS_TABLE)
    .select('version')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw toCloudError(error)
  return data?.version ?? null
}

export async function vaultExists(): Promise<boolean> {
  return (await fetchVersionForUser(await requireCurrentUserId())) !== null
}

/** Versión remota actual (para detectar cambios hechos desde otro dispositivo). */
export async function fetchRemoteVaultVersion(): Promise<number | null> {
  return fetchVersionForUser(requireVaultSession().userId)
}

export function commitKnownVaultVersion(version: number): void {
  const currentSession = getVaultSession()
  if (currentSession) currentSession.version = version
}

export function getKnownVaultVersion(): number | null {
  return getVaultSession()?.version ?? null
}

/** Crea el vault de la cuenta con el contenido inicial, cifrado con la clave nueva. */
export async function createVaultFile(householdKey: string, initialVault: unknown): Promise<void> {
  const userId = await requireCurrentUserId()
  const salt = generateSalt()
  const { aesKey, fingerprint } = await deriveVaultKey(householdKey, salt)
  const envelope = await encryptVaultJson(JSON.stringify(initialVault), aesKey, salt)
  const { error } = await getSupabase()
    .from(VAULTS_TABLE)
    .insert({ user_id: userId, envelope, version: 1 })
  if (error) {
    if (error.code === UNIQUE_VIOLATION) throw new VaultAlreadyExistsError()
    throw toCloudError(error)
  }
  setVaultSession({ userId, aesKey, fingerprint, salt, iterations: PBKDF2_ITERATIONS, version: 1 })
}

export async function unlockVaultFile(householdKey: string): Promise<unknown> {
  const userId = await requireCurrentUserId()
  const remote = await fetchRemoteVaultForUser(userId)
  if (!remote) throw new VaultNotFoundError()
  return openEnvelope(userId, remote.envelope, householdKey, remote.version)
}

/**
 * Descifra el vault remoto con la clave de la sesión actual (otro dispositivo guardó
 * cambios). Si la clave del hogar se cambió en otro lado, tira `InvalidHouseholdKeyError`.
 * No toca la versión conocida: el llamador la confirma con `commitKnownVaultVersion`
 * recién cuando rehidrata el store.
 */
export async function downloadRemoteVault(): Promise<{ vaultJson: unknown; version: number }> {
  const currentSession = requireVaultSession()
  const remote = await fetchRemoteVaultForUser(currentSession.userId)
  if (!remote) throw new VaultNotFoundError()
  if (remote.envelope.salt !== bytesToBase64(currentSession.salt)) {
    throw new InvalidHouseholdKeyError()
  }
  const vaultJson = parseJson(await decryptVaultEnvelope(remote.envelope, currentSession.aesKey))
  return { vaultJson, version: remote.version }
}

export async function lockVaultFile(): Promise<void> {
  clearVaultSession()
}

export async function verifyHouseholdKey(candidateKey: string): Promise<boolean> {
  const { salt, iterations, fingerprint } = requireVaultSession()
  const candidate = await deriveVaultKey(candidateKey, salt, iterations)
  const isValid = constantTimeEqual(fingerprint, candidate.fingerprint)
  candidate.fingerprint.fill(0)
  return isValid
}

/**
 * Guarda con concurrencia optimista: solo actualiza si la versión remota sigue siendo
 * la que conoce este dispositivo. Si otro dispositivo guardó antes → `VaultConflictError`.
 */
export async function saveVaultFile(vaultJson: unknown): Promise<void> {
  const currentSession = requireVaultSession()
  const expectedVersion = currentSession.version
  const envelope = await encryptVaultJson(
    JSON.stringify(vaultJson),
    currentSession.aesKey,
    currentSession.salt,
    currentSession.iterations
  )
  const { data, error } = await getSupabase()
    .from(VAULTS_TABLE)
    .update({ envelope, version: expectedVersion + 1 })
    .eq('user_id', currentSession.userId)
    .eq('version', expectedVersion)
    .select('version')
  if (error) throw toCloudError(error)
  if (!data || data.length === 0) throw new VaultConflictError()
  currentSession.version = data[0].version
}

/**
 * Re-cifra el contenido actual con una clave nueva (salt nuevo). Se verifica antes la
 * clave actual contra la sesión.
 */
export async function changeHouseholdKey(
  currentKey: string,
  newKey: string,
  vaultJson: unknown
): Promise<void> {
  const currentSession = requireVaultSession()
  if (!(await verifyHouseholdKey(currentKey))) {
    throw new InvalidHouseholdKeyError()
  }
  const salt = generateSalt()
  const { aesKey, fingerprint } = await deriveVaultKey(newKey, salt)
  const envelope = await encryptVaultJson(JSON.stringify(vaultJson), aesKey, salt)
  const expectedVersion = currentSession.version
  const { data, error } = await getSupabase()
    .from(VAULTS_TABLE)
    .update({ envelope, version: expectedVersion + 1 })
    .eq('user_id', currentSession.userId)
    .eq('version', expectedVersion)
    .select('version')
  if (error) throw toCloudError(error)
  if (!data || data.length === 0) throw new VaultConflictError()
  setVaultSession({
    userId: currentSession.userId,
    aesKey,
    fingerprint,
    salt,
    iterations: PBKDF2_ITERATIONS,
    version: data[0].version
  })
}

/**
 * Descarga un respaldo `.dat` con el contenido actual, cifrado con la clave del hogar
 * de la sesión. Es el mismo formato que exportaba la app de escritorio.
 */
export async function exportVaultBackup(vaultJson: unknown): Promise<string> {
  const { aesKey, salt, iterations } = requireVaultSession()
  const envelope = await encryptVaultJson(JSON.stringify(vaultJson), aesKey, salt, iterations)
  downloadBlob(
    new Blob([JSON.stringify(envelope)], { type: 'application/octet-stream' }),
    BACKUP_FILE_NAME
  )
  return BACKUP_FILE_NAME
}

/** Abre el selector y valida que el archivo sea un respaldo de Gastito. */
export async function pickVaultBackupFile(): Promise<VaultEnvelope | null> {
  const file = await pickFile('.dat,application/octet-stream')
  if (!file) return null
  if (file.size > MAX_BACKUP_FILE_BYTES) {
    throw new InvalidBackupFileError()
  }
  return parseVaultEnvelope(await file.text())
}

/** Respaldo ya descifrado con su clave, listo para validar y (recién después) subir. */
export type OpenedVaultBackup = {
  vaultJson: unknown
  aesKey: CryptoKey
  fingerprint: Bytes
  salt: Bytes
  iterations: number
}

/**
 * Paso 1 de restaurar un respaldo: verifica que `householdKey` lo descifre. No toca la
 * nube ni la sesión: el llamador valida el contenido antes de subirlo.
 */
export async function openVaultBackup(
  envelope: VaultEnvelope,
  householdKey: string
): Promise<OpenedVaultBackup> {
  const salt = base64ToBytes(envelope.salt)
  const { aesKey, fingerprint } = await deriveVaultKey(householdKey, salt, envelope.iterations)
  const vaultJson = parseJson(await decryptVaultEnvelope(envelope, aesKey))
  return { vaultJson, aesKey, fingerprint, salt, iterations: envelope.iterations }
}

/**
 * Paso 2: sube el contenido (ya validado) cifrado con la clave del respaldo. Recién si
 * la subida sale bien se cambia la sesión a esa clave. Con `replace: false` falla si la
 * cuenta ya tiene datos.
 */
export async function uploadVaultBackup(
  opened: OpenedVaultBackup,
  vaultFile: unknown,
  { replace }: { replace: boolean }
): Promise<void> {
  const userId = await requireCurrentUserId()
  const { aesKey, fingerprint, salt, iterations } = opened
  const envelope = await encryptVaultJson(JSON.stringify(vaultFile), aesKey, salt, iterations)

  const remoteVersion = await fetchVersionForUser(userId)
  let version: number
  if (remoteVersion === null) {
    const { error } = await getSupabase()
      .from(VAULTS_TABLE)
      .insert({ user_id: userId, envelope, version: 1 })
    if (error) {
      if (error.code === UNIQUE_VIOLATION) throw new VaultAlreadyExistsError()
      throw toCloudError(error)
    }
    version = 1
  } else {
    if (!replace) throw new VaultAlreadyExistsError()
    const { data, error } = await getSupabase()
      .from(VAULTS_TABLE)
      .update({ envelope, version: remoteVersion + 1 })
      .eq('user_id', userId)
      .eq('version', remoteVersion)
      .select('version')
    if (error) throw toCloudError(error)
    if (!data || data.length === 0) throw new VaultConflictError()
    version = data[0].version
  }

  setVaultSession({ userId, aesKey, fingerprint, salt, iterations, version })
}

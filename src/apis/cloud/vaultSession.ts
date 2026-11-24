import { VaultNotUnlockedError } from './errors'
import type { Bytes } from './vaultCrypto'

/**
 * Sesión del vault desbloqueado. Vive SOLO en memoria (scope de módulo): la clave AES
 * no es exportable y nunca se persiste. Se limpia al bloquear o al cerrar sesión.
 */
export type VaultSession = {
  userId: string
  aesKey: CryptoKey
  fingerprint: Bytes
  salt: Bytes
  iterations: number
  /** Última versión de la fila `vaults` que conoce este dispositivo (concurrencia optimista). */
  version: number
}

let session: VaultSession | null = null

export function setVaultSession(next: VaultSession): void {
  if (session && session !== next) {
    session.fingerprint.fill(0)
  }
  session = next
}

export function getVaultSession(): VaultSession | null {
  return session
}

export function requireVaultSession(): VaultSession {
  if (!session) {
    throw new VaultNotUnlockedError()
  }
  return session
}

export function clearVaultSession(): void {
  if (session) {
    session.fingerprint.fill(0)
  }
  session = null
}

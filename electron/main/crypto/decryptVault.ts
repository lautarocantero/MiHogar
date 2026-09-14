import { createDecipheriv } from 'crypto'
import type { VaultEnvelope } from '@shared/vaultEnvelope.types'

export class InvalidHouseholdKeyError extends Error {
  constructor() {
    super('La clave del hogar no es correcta o el archivo está dañado')
    this.name = 'InvalidHouseholdKeyError'
  }
}

export function decryptVault(envelope: VaultEnvelope, key: Buffer): string {
  const iv = Buffer.from(envelope.iv, 'base64')
  const authTag = Buffer.from(envelope.authTag, 'base64')
  const ciphertext = Buffer.from(envelope.ciphertext, 'base64')

  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)

  try {
    const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()])
    return plain.toString('utf8')
  } catch {
    throw new InvalidHouseholdKeyError()
  }
}

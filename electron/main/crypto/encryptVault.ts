import { createCipheriv, randomBytes } from 'crypto'
import type { VaultEnvelope } from '@shared/vaultEnvelope.types'
import { KDF_ITERATIONS } from './deriveKey'

const IV_LENGTH_BYTES = 12

export function encryptVault(plainJson: string, key: Buffer, salt: Buffer): VaultEnvelope {
  const iv = randomBytes(IV_LENGTH_BYTES)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(plainJson, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    v: 1,
    kdf: 'pbkdf2',
    iterations: KDF_ITERATIONS,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: ciphertext.toString('base64')
  }
}

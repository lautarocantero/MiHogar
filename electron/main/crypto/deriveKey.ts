import { pbkdf2Sync, randomBytes } from 'crypto'

const PBKDF2_ITERATIONS = 600_000
const KEY_LENGTH_BYTES = 32
const SALT_LENGTH_BYTES = 16

export function generateSalt(): Buffer {
  return randomBytes(SALT_LENGTH_BYTES)
}

export function deriveKey(householdKey: string, salt: Buffer): Buffer {
  return pbkdf2Sync(householdKey, salt, PBKDF2_ITERATIONS, KEY_LENGTH_BYTES, 'sha256')
}

export const KDF_ITERATIONS = PBKDF2_ITERATIONS

import { readFile } from 'fs/promises'
import type { VaultEnvelope } from '@shared/vaultEnvelope.types'
import { getVaultFilePath } from './vaultPaths'

export async function readVaultFile(): Promise<VaultEnvelope> {
  const raw = await readFile(getVaultFilePath(), 'utf8')
  return JSON.parse(raw) as VaultEnvelope
}

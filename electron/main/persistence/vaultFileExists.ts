import { existsSync } from 'fs'
import { getVaultFilePath } from './vaultPaths'

export function vaultFileExists(): boolean {
  return existsSync(getVaultFilePath())
}

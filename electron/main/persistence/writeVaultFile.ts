import { copyFile, rename, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { VaultEnvelope } from '@shared/vaultEnvelope.types'
import { getVaultBackupPath, getVaultFilePath, getVaultTempPath } from './vaultPaths'

export async function writeVaultFile(envelope: VaultEnvelope): Promise<void> {
  const finalPath = getVaultFilePath()
  const tempPath = getVaultTempPath()
  const backupPath = getVaultBackupPath()

  if (existsSync(finalPath)) {
    await copyFile(finalPath, backupPath)
  }

  await writeFile(tempPath, JSON.stringify(envelope), 'utf8')
  await rename(tempPath, finalPath)
}

import { app } from 'electron'
import { join } from 'path'

export function getVaultFilePath(): string {
  return join(app.getPath('userData'), 'vault.dat')
}

export function getVaultBackupPath(): string {
  return join(app.getPath('userData'), 'vault.dat.bak')
}

export function getVaultTempPath(): string {
  return join(app.getPath('userData'), 'vault.dat.tmp')
}

export function getPreferencesFilePath(): string {
  return join(app.getPath('userData'), 'preferences.json')
}

export function getAttachmentsDir(): string {
  return join(app.getPath('userData'), 'attachments')
}

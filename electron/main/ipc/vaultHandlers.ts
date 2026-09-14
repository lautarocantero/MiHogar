import { ipcMain, dialog, BrowserWindow } from 'electron'
import { copyFile, readFile } from 'fs/promises'
import { timingSafeEqual } from 'crypto'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type { VaultEnvelope, ReminderNotification } from '@shared/vaultEnvelope.types'
import { deriveKey, generateSalt } from '../crypto/deriveKey'
import { encryptVault } from '../crypto/encryptVault'
import { decryptVault } from '../crypto/decryptVault'
import { vaultFileExists } from '../persistence/vaultFileExists'
import { readVaultFile } from '../persistence/readVaultFile'
import { writeVaultFile } from '../persistence/writeVaultFile'
import { getVaultBackupPath, getVaultFilePath } from '../persistence/vaultPaths'
import { setSessionKey, getSessionKey, getSessionSalt, clearSession } from '../session/vaultSession'
import { notifyPendingPayments } from '../notifications/paymentReminders'

const EMPTY_VAULT_JSON = JSON.stringify({
  version: 1,
  household: { name: '' },
  members: [],
  accounts: [],
  payments: [],
  movements: [],
  savingsInstruments: [],
  categories: []
})

function requireUnlockedKey(): Buffer {
  const key = getSessionKey()
  if (!key) {
    throw new Error('El vault no está desbloqueado')
  }
  return key
}

export function registerVaultHandlers(mainWindow: BrowserWindow): void {
  ipcMain.handle(IPC_CHANNELS.VAULT_EXISTS, () => {
    return vaultFileExists()
  })

  ipcMain.handle(IPC_CHANNELS.VAULT_CREATE, async (_event, householdKey: string) => {
    const salt = generateSalt()
    const key = deriveKey(householdKey, salt)
    const envelope = encryptVault(EMPTY_VAULT_JSON, key, salt)
    await writeVaultFile(envelope)
    setSessionKey(key, salt)
    return JSON.parse(EMPTY_VAULT_JSON)
  })

  ipcMain.handle(IPC_CHANNELS.VAULT_UNLOCK, async (_event, householdKey: string) => {
    const envelope = await readVaultFile()
    const salt = Buffer.from(envelope.salt, 'base64')
    const key = deriveKey(householdKey, salt)
    const plainJson = decryptVault(envelope, key)
    setSessionKey(key, salt)
    return JSON.parse(plainJson)
  })

  ipcMain.handle(IPC_CHANNELS.VAULT_LOCK, () => {
    clearSession()
  })

  ipcMain.handle(IPC_CHANNELS.VAULT_VERIFY_KEY, (_event, candidateKey: string) => {
    const sessionKey = requireUnlockedKey()
    const salt = getSessionSalt()
    if (!salt) {
      throw new Error('El vault no está desbloqueado')
    }
    const candidateDerivedKey = deriveKey(candidateKey, salt)
    return timingSafeEqual(sessionKey, candidateDerivedKey)
  })

  ipcMain.handle(IPC_CHANNELS.VAULT_SAVE, async (_event, vaultJson: unknown) => {
    const key = requireUnlockedKey()
    const salt = getSessionSalt()
    if (!salt) {
      throw new Error('El vault no está desbloqueado')
    }
    const envelope = encryptVault(JSON.stringify(vaultJson), key, salt)
    await writeVaultFile(envelope)
  })

  ipcMain.handle(
    IPC_CHANNELS.VAULT_CHANGE_KEY,
    async (_event, currentKey: string, newKey: string) => {
      const envelope = await readVaultFile()
      const currentSalt = Buffer.from(envelope.salt, 'base64')
      const currentDerivedKey = deriveKey(currentKey, currentSalt)
      const plainJson = decryptVault(envelope, currentDerivedKey)

      const newSalt = generateSalt()
      const newDerivedKey = deriveKey(newKey, newSalt)
      const newEnvelope: VaultEnvelope = encryptVault(plainJson, newDerivedKey, newSalt)
      await writeVaultFile(newEnvelope)
      setSessionKey(newDerivedKey, newSalt)
    }
  )

  ipcMain.handle(IPC_CHANNELS.VAULT_EXPORT, async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar respaldo de Mi Hogar',
      defaultPath: 'mihogar-respaldo.dat',
      filters: [{ name: 'Respaldo de Mi Hogar', extensions: ['dat'] }]
    })
    if (result.canceled || !result.filePath) {
      return null
    }
    await copyFile(getVaultFilePath(), result.filePath)
    return result.filePath
  })

  ipcMain.handle(IPC_CHANNELS.VAULT_IMPORT, async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Importar respaldo de Mi Hogar',
      properties: ['openFile'],
      filters: [{ name: 'Respaldo de Mi Hogar', extensions: ['dat'] }]
    })
    if (result.canceled || result.filePaths.length === 0) {
      return false
    }

    const raw = await readFile(result.filePaths[0], 'utf8')
    JSON.parse(raw)

    if (vaultFileExists()) {
      await copyFile(getVaultFilePath(), getVaultBackupPath())
    }
    await copyFile(result.filePaths[0], getVaultFilePath())
    clearSession()
    return true
  })

  ipcMain.handle(IPC_CHANNELS.REMINDERS_CHECK, (_event, reminders: ReminderNotification[]) => {
    notifyPendingPayments(reminders)
  })
}

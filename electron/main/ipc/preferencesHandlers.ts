import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type { PreferencesFile } from '@shared/vaultEnvelope.types'
import { readPreferences, writePreferences } from '../persistence/preferencesStore'

export function registerPreferencesHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PREFS_GET, () => {
    return readPreferences()
  })

  ipcMain.handle(IPC_CHANNELS.PREFS_SET, (_event, preferences: PreferencesFile) => {
    return writePreferences(preferences)
  })
}

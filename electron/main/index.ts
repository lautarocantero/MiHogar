import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './windowManager'
import { registerVaultHandlers } from './ipc/vaultHandlers'
import { registerAttachmentHandlers } from './ipc/attachmentHandlers'
import { registerPreferencesHandlers } from './ipc/preferencesHandlers'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.mihogar.app')

  app.on('browser-window-created', (_event, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createMainWindow()

  registerVaultHandlers(mainWindow)
  registerAttachmentHandlers()
  registerPreferencesHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

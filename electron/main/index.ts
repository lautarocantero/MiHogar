import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './windowManager'
import { registerVaultHandlers } from './ipc/vaultHandlers'
import { registerAttachmentHandlers } from './ipc/attachmentHandlers'
import { registerPreferencesHandlers } from './ipc/preferencesHandlers'

if (process.platform === 'linux') {
  // El AppImage no queda instalado con el chrome-sandbox setuid root que
  // Chromium exige para sandboxear sin este flag (falla con
  // "SUID sandbox helper binary... not configured correctly" en Linux al
  // correr sin instalación privilegiada). La app no carga contenido remoto,
  // así que desactivar el sandbox de Chromium acá es un tradeoff aceptable.
  app.commandLine.appendSwitch('no-sandbox')
}

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

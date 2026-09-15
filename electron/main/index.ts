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
  // Evita que Chromium use /dev/shm para memoria compartida: en algunos
  // hosts falla con "Creating shared memory in /dev/shm/... failed: No
  // such process" pese a que los permisos del directorio son correctos.
  app.commandLine.appendSwitch('disable-dev-shm-usage')
  // El proceso zygote sigue intentando crear un user namespace incluso con
  // --no-sandbox, y en hosts con AppArmor restringiendo userns sin
  // privilegios (Ubuntu 24.04+/26.04 por defecto) esa creación queda
  // denegada, dejando al zygote en un estado roto que hace fallar la
  // memoria compartida de cualquier proceso hijo (gpu-process, renderer).
  // Sin zygote, cada proceso se forkea directo del browser y evita ese
  // camino.
  app.commandLine.appendSwitch('no-zygote')
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

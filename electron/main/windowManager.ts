import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // El sandbox OS-level de Chromium para el renderer requiere el helper
      // chrome-sandbox con setuid root, que un AppImage sin instalar no
      // tiene. Con sandbox:true, Electron agrega --enable-sandbox al
      // renderer sin importar el --no-sandbox global de index.ts, y bajo el
      // scope de systemd que usa GNOME Shell para lanzar apps, el kernel
      // (AppArmor restringiendo user namespaces sin privilegios en Ubuntu
      // 24.04+) rechaza esa inicialización y Chromium aborta con
      // "SUID sandbox helper... not configured correctly". La app no carga
      // contenido remoto, así que queda cubierta por contextIsolation +
      // nodeIntegration:false sin necesitar el sandbox de proceso de Chromium.
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

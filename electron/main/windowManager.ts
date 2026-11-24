import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

function isExternalHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    // La UI es responsive (360px → desktop), así que la ventana puede achicarse.
    minWidth: 360,
    minHeight: 560,
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
    // Solo los links https se abren en el navegador del sistema. blob:, file: y
    // cualquier otro esquema se descartan: los adjuntos se descargan desde el renderer.
    if (isExternalHttpsUrl(details.url)) {
      void shell.openExternal(details.url)
    }
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

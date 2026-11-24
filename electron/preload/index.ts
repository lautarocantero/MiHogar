import { contextBridge } from 'electron'

/**
 * La app de escritorio usa la misma UI que la web: vault, adjuntos, preferencias,
 * recordatorios e importación de boletas viven en el renderer (Supabase + WebCrypto +
 * localStorage + pdfjs/xlsx). El preload solo marca que la UI corre dentro de Electron.
 */
contextBridge.exposeInMainWorld('desktopApp', { isDesktop: true })

/** Marca que expone el preload de Electron; en la web no existe. */
export type DesktopAppInfo = {
  isDesktop: true
}

declare global {
  interface Window {
    desktopApp?: DesktopAppInfo
  }
}

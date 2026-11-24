/** Descarga un Blob como archivo (funciona en la web y en Electron). */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // Se revoca más tarde para que el navegador alcance a iniciar la descarga.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

/**
 * Abre el selector de archivos del sistema. Resuelve `null` si el usuario cancela
 * (evento `cancel`, soportado por los navegadores actuales y por Electron).
 */
export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.style.display = 'none'
    const finish = (file: File | null): void => {
      input.remove()
      resolve(file)
    }
    input.addEventListener('change', () => finish(input.files?.[0] ?? null), { once: true })
    input.addEventListener('cancel', () => finish(null), { once: true })
    document.body.appendChild(input)
    input.click()
  })
}

export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && window.desktopApp?.isDesktop === true
}

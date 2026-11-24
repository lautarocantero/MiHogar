import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { extractTextFromPdfDocument, type PdfPageRenderer } from './pdfText'

/**
 * Carga `pdfjs-dist` bajo demanda (queda en un chunk aparte: no infla el bundle inicial) y
 * configura el worker que Vite emite como asset propio (compatible con la CSP
 * `worker-src 'self'`).
 */
async function loadPdfjs(): Promise<typeof import('pdfjs-dist')> {
  const pdfjs = await import('pdfjs-dist')
  if (pdfjs.GlobalWorkerOptions.workerSrc !== workerUrl) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  }
  return pdfjs
}

export async function extractPdfText(
  fileData: Uint8Array,
  renderPage?: PdfPageRenderer
): Promise<string> {
  const pdfjs = await loadPdfjs()
  // pdf.js transfiere el buffer al worker (lo deja inutilizable): se le pasa una copia.
  const loadingTask = pdfjs.getDocument({ data: fileData.slice(), isEvalSupported: false })
  const document = await loadingTask.promise
  return extractTextFromPdfDocument(document, renderPage)
}

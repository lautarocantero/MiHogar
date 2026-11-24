/**
 * Extracción de texto de PDF con `pdfjs-dist`, calcando la salida de `pdf-parse@1.1.1` (que es
 * con lo que se escribieron y midieron los parsers de MP y Galicia). Este archivo no importa
 * `pdfjs-dist` en runtime — recibe el documento ya cargado — para poder probarlo en Node contra
 * `pdf-parse` (ver `pdfjsLoader.ts` para la carga en el navegador).
 */

export type PdfTextItem = {
  str: string
  width?: number
  transform: number[]
}

export type PdfTextContent = { items: unknown[] }

export type PdfPageLike = {
  getTextContent: (options?: Record<string, unknown>) => Promise<PdfTextContent>
}

export type PdfDocumentLike = {
  numPages: number
  getPage: (pageNumber: number) => Promise<PdfPageLike>
  destroy: () => Promise<void>
}

export type PdfPageRenderer = (page: PdfPageLike) => Promise<string>

function isTextItem(item: unknown): item is PdfTextItem {
  return typeof item === 'object' && item !== null && 'str' in item && 'transform' in item
}

/**
 * Devuelve los items de texto tal como los entregaba pdf.js 1.10.100 (el que trae `pdf-parse`).
 *
 * pdfjs-dist 4.x agrega dos tipos de items sintéticos que la versión vieja no generaba:
 * - `{ str: '', hasEOL: true }` al cambiar de línea (con la Y de la línea nueva);
 * - `{ str: ' ' }` "de relleno" que cubre el hueco entre dos columnas de la misma línea.
 * Ninguno sale de un glifo real (4.x saltea los glifos de espacio y los representa así), por
 * eso se descartan todos los items que son sólo espacios. Lo que queda tiene el mismo `str`,
 * `transform` y `width` que en 1.10.100 (verificado con PDFs de prueba, ver informe del cambio).
 * También se descartan los items de "marked content" (sin `str`).
 */
export function getTextItems(textContent: PdfTextContent): PdfTextItem[] {
  return textContent.items.filter(
    (item): item is PdfTextItem => isTextItem(item) && item.str.trim().length > 0
  )
}

/**
 * Copia literal del `render_page` por defecto de `pdf-parse@1.1.1`
 * (`node_modules/pdf-parse/lib/pdf-parse.js`): concatena los items mientras la coordenada Y
 * (`transform[5]`) no cambie y mete '\n' cuando cambia. Ojo: `!lastY` también es verdadero con
 * Y = 0 — se respeta tal cual para no cambiar el texto que ven los parsers.
 */
export async function renderPageLikePdfParse(page: PdfPageLike): Promise<string> {
  const textContent = await page.getTextContent()
  let lastY: number | undefined
  let text = ''
  for (const item of getTextItems(textContent)) {
    if (lastY == item.transform[5] || !lastY) {
      text += item.str
    } else {
      text += '\n' + item.str
    }
    lastY = item.transform[5]
  }
  return text
}

/**
 * Igual que `PDF()` de `pdf-parse@1.1.1`: cada página se antepone con '\n\n' (el texto final
 * empieza con '\n\n') y una página que falla al renderizar aporta '' en vez de cortar todo.
 */
export async function extractTextFromPdfDocument(
  document: PdfDocumentLike,
  renderPage: PdfPageRenderer = renderPageLikePdfParse
): Promise<string> {
  let text = ''
  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const pageText = await document
        .getPage(pageNumber)
        .then((page) => renderPage(page))
        .catch(() => '')
      text = `${text}\n\n${pageText}`
    }
  } finally {
    await document.destroy()
  }
  return text
}

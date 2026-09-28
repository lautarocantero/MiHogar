import pdfParse from 'pdf-parse'
import type { ParsedStatementRowDto, ParseStatementResult } from '@shared/vaultEnvelope.types'
import type { StatementParser } from './index'

const ROW_DATE = /^(\d{2})-(\d{2})-(\d{2})$/
const PURE_AMOUNT = /^-?\d{1,3}(\.\d{3})*,\d{2}$/
const PURE_DIGITS = /^\d+$/
const CUOTA = /^\d{2}\/\d{2}$/
const MARCA = /^[*K]$/

const MONTHS: Record<string, string> = {
  Ene: '01',
  Feb: '02',
  Mar: '03',
  Abr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Ago: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dic: '12'
}

function parseArsAmount(raw: string): number {
  return Number(raw.trim().replace(/\./g, '').replace(',', '.'))
}

function toIsoDateFromDdMmAa(ddmmaa: string): string {
  const match = ROW_DATE.exec(ddmmaa)
  if (!match) throw new Error(`Fecha inesperada: ${ddmmaa}`)
  const [, day, month, year] = match
  return `20${year}-${month}-${day}`
}

/**
 * Reconstruye columnas insertando un separador '§' cuando hay un salto horizontal grande entre
 * dos items de texto en la misma línea del PDF — pdf-parse en modo default los pega sin espacio
 * (ej. comprobante y monto quedan literalmente adyacentes: "00594711.828,00"). Sin esto no se
 * puede separar de forma confiable columna por columna (research.md §4).
 */
function renderPageWithColumns(pageData: {
  getTextContent: (opts: unknown) => Promise<{ items: TextItem[] }>
}): Promise<string> {
  const options = { normalizeWhitespace: false, disableCombineTextItems: false }
  return pageData.getTextContent(options).then((textContent) => {
    let lastY: number | undefined
    let lastEndX: number | undefined
    let text = ''
    for (const item of textContent.items) {
      const x = item.transform[4]
      const y = item.transform[5]
      const width = item.width ?? 0
      if (lastY !== undefined && Math.abs(y - lastY) < 1) {
        const gap = lastEndX !== undefined ? x - lastEndX : 0
        if (gap > 3) text += ' §'
        text += item.str
      } else {
        text += `\n${item.str}`
      }
      lastY = y
      lastEndX = x + width
    }
    return text
  })
}

type TextItem = { str: string; width?: number; transform: number[] }

/**
 * Fecha del "saldo anterior" (spec §2, decisión v10: se importa igual, riesgo de duplicado
 * aceptado). La línea SALDO ANTERIOR no trae fecha propia en el resumen — se usa la primera
 * fecha del cronograma de vencimientos ("30-Jul-26 07-Ago-26 ...", el cierre del período
 * anterior), que es la mejor aproximación disponible en el propio documento.
 */
function findSaldoAnteriorDate(fullText: string): string | undefined {
  const calendarMatch = /(\d{1,2})-([A-Za-z]{3})-(\d{2})/.exec(fullText)
  if (!calendarMatch) return undefined
  const [, day, monthName, year] = calendarMatch
  const month = MONTHS[monthName]
  if (!month) return undefined
  return `20${year}-${month}-${day.padStart(2, '0')}`
}

function parseRow(line: string): ParsedStatementRowDto | 'usd' | 'skip' {
  if (line.includes('USD')) return 'usd'

  const segments = line
    .split('§')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)

  if (segments.length === 0 || !ROW_DATE.test(segments[0])) return 'skip'

  const date = toIsoDateFromDdMmAa(segments[0])
  const rest = segments.slice(1)

  const amountSegments = rest.filter((segment) => PURE_AMOUNT.test(segment))
  if (amountSegments.length === 0) return 'skip'
  const amount = parseArsAmount(amountSegments[0])

  const comprobante = rest.find((segment) => PURE_DIGITS.test(segment))
  const cuota = rest.find((segment) => CUOTA.test(segment))

  const descriptionParts = rest.filter(
    (segment) =>
      !PURE_AMOUNT.test(segment) &&
      !PURE_DIGITS.test(segment) &&
      !CUOTA.test(segment) &&
      !MARCA.test(segment)
  )
  const description = descriptionParts.join(' ').replace(/\s+/g, ' ').trim()

  return {
    date,
    amount,
    description: description || 'Movimiento tarjeta Galicia',
    sourceRef: comprobante ? `${comprobante}${cuota ? ` (cuota ${cuota})` : ''}` : cuota
  }
}

function parseGaliciaSection(fullText: string): {
  rows: ParsedStatementRowDto[]
  skippedCount: number
} {
  const sectionStart = fullText.indexOf('CONSOLIDADO')
  const sectionEnd = fullText.indexOf('TOTAL A PAGAR')
  if (sectionStart === -1) return { rows: [], skippedCount: 0 }
  const section = fullText.slice(sectionStart, sectionEnd === -1 ? fullText.length : sectionEnd)

  const rows: ParsedStatementRowDto[] = []
  let skippedCount = 0

  const saldoAnteriorMatch = /SALDO ANTERIOR\s*§?\s*(-?\d{1,3}(?:\.\d{3})*,\d{2})/.exec(section)
  if (saldoAnteriorMatch) {
    const saldoAnteriorDate = findSaldoAnteriorDate(fullText)
    if (saldoAnteriorDate) {
      rows.push({
        date: saldoAnteriorDate,
        amount: parseArsAmount(saldoAnteriorMatch[1]),
        description: 'Saldo anterior'
      })
    } else {
      skippedCount++
    }
  }

  for (const line of section.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || !ROW_DATE.test(trimmed.split('§')[0]?.trim() ?? '')) continue

    const result = parseRow(trimmed)
    if (result === 'usd' || result === 'skip') {
      if (result === 'usd') skippedCount++
      continue
    }
    rows.push(result)
  }

  return { rows, skippedCount }
}

export const galiciaTarjetaPdfParser: StatementParser = {
  async parse(fileBuffer: Buffer): Promise<ParseStatementResult> {
    const { text } = await pdfParse(fileBuffer, { pagerender: renderPageWithColumns })
    return parseGaliciaSection(text)
  }
}

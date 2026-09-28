import pdfParse from 'pdf-parse'
import type { ParsedStatementRowDto, ParseStatementResult } from '@shared/vaultEnvelope.types'
import type { StatementParser } from './index'

const DATE_LINE = /^(\d{2})-(\d{2})-(\d{4})$/
const ROW_END_LINE = /^(\d+)\$\s*(-?[\d.,]+)\$\s*(-?[\d.,]+)$/
const NOISE_LINE =
  /^(FechaDescripción|ID de la|operación|ValorSaldo|Fecha de generación.*|Mercado Libre S\.R\.L\..*|Estas operaciones.*|ante la C\.N\.V\).*|en la operación\.|Encuentra nuestros.*|Encontrá nuestros.*|consulta en:.*|\d+\/\d+)$/

function parseArsAmount(raw: string): number {
  const normalized = raw.trim().replace(/\./g, '').replace(',', '.')
  return Number(normalized)
}

function toIsoDate(ddmmyyyy: string): string {
  const match = DATE_LINE.exec(ddmmyyyy)
  if (!match) throw new Error(`Fecha inesperada: ${ddmmyyyy}`)
  const [, day, month, year] = match
  return `${year}-${month}-${day}`
}

/**
 * El PDF de MP trae, además del resumen de cuenta en pesos, un segundo resumen de tenencias en
 * dólares al final (mismo archivo). Se recorta antes de esa sección — el flujo es sólo ARS
 * (spec Supuesto 5).
 */
function extractArsSection(fullText: string): string {
  const start = fullText.indexOf('DETALLE DE MOVIMIENTOS')
  const dollarsMarker = fullText.indexOf('RESUMEN DE TENENCIAS EN DÓLARES')
  const end = dollarsMarker === -1 ? fullText.length : dollarsMarker
  if (start === -1) return ''
  return fullText.slice(start, end)
}

function parseRows(text: string): { rows: ParsedStatementRowDto[]; skippedCount: number } {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !NOISE_LINE.test(line))

  const rows: ParsedStatementRowDto[] = []
  let skippedCount = 0
  let i = 0

  while (i < lines.length) {
    if (!DATE_LINE.test(lines[i])) {
      i++
      continue
    }

    const date = toIsoDate(lines[i])
    i++

    const descriptionParts: string[] = []
    while (i < lines.length && !ROW_END_LINE.test(lines[i]) && !DATE_LINE.test(lines[i])) {
      descriptionParts.push(lines[i])
      i++
    }

    if (i >= lines.length || !ROW_END_LINE.test(lines[i])) {
      skippedCount++
      continue
    }

    const rowEndMatch = ROW_END_LINE.exec(lines[i])
    if (!rowEndMatch) {
      skippedCount++
      continue
    }
    const [, sourceRef, amountRaw] = rowEndMatch
    i++

    rows.push({
      date,
      amount: parseArsAmount(amountRaw),
      description: descriptionParts.join(' ').trim() || 'Movimiento Mercado Pago',
      sourceRef
    })
  }

  return { rows, skippedCount }
}

export const mercadoPagoPdfParser: StatementParser = {
  async parse(fileBuffer: Buffer): Promise<ParseStatementResult> {
    const { text } = await pdfParse(fileBuffer)
    const arsSection = extractArsSection(text)
    return parseRows(arsSection)
  }
}

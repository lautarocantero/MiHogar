import * as XLSX from 'xlsx'
import type { ParsedStatementRowDto, ParseStatementResult } from '@shared/vaultEnvelope.types'
import type { StatementParser } from './index'

/**
 * DIFERIDO — sin archivo real de ejemplo de Galicia en Excel/CSV (spec §5 Supuesto 1, §8 NO
 * MEDIDO). Reusa el mismo mapeo de columnas asumido que MP (Fecha, Descripción/Referencia,
 * Monto), sin AC verificable. No bloquea el resto de la feature (tasks.md Fase 6, US4).
 */
const HEADER_ALIASES = {
  date: ['fecha'],
  amount: ['pesos', 'monto', 'importe'],
  description: ['referencia', 'descripción', 'descripcion', 'concepto'],
  sourceRef: ['comprobante']
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

function findColumn(headers: string[], aliases: string[]): string | undefined {
  return headers.find((header) => aliases.includes(normalizeHeader(header)))
}

function toIsoDate(rawDate: string): string | undefined {
  const ddmmaa = /^(\d{2})-(\d{2})-(\d{2})$/.exec(rawDate.trim())
  if (ddmmaa) return `20${ddmmaa[3]}-${ddmmaa[2]}-${ddmmaa[1]}`
  const ddmmyyyy = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(rawDate.trim())
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`
  return undefined
}

function parseAmount(raw: string | number): number | undefined {
  if (typeof raw === 'number') return raw
  const normalized = raw.trim().replace(/\./g, '').replace(',', '.')
  const value = Number(normalized)
  return Number.isFinite(value) ? value : undefined
}

export const galiciaExcelParser: StatementParser = {
  async parse(fileBuffer: Buffer): Promise<ParseStatementResult> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawRows: Record<string, string | number>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: ''
    })

    if (rawRows.length === 0) return { rows: [], skippedCount: 0 }

    const headers = Object.keys(rawRows[0])
    const dateCol = findColumn(headers, HEADER_ALIASES.date)
    const amountCol = findColumn(headers, HEADER_ALIASES.amount)
    const descriptionCol = findColumn(headers, HEADER_ALIASES.description)
    const sourceRefCol = findColumn(headers, HEADER_ALIASES.sourceRef)

    if (!dateCol || !amountCol) return { rows: [], skippedCount: rawRows.length }

    const rows: ParsedStatementRowDto[] = []
    let skippedCount = 0

    for (const rawRow of rawRows) {
      const rawAmount = String(rawRow[amountCol])
      if (rawAmount.includes('USD')) {
        skippedCount++
        continue
      }
      const date = toIsoDate(String(rawRow[dateCol]))
      const amount = parseAmount(rawRow[amountCol])
      if (!date || amount === undefined) {
        skippedCount++
        continue
      }
      rows.push({
        date,
        amount,
        description: descriptionCol ? String(rawRow[descriptionCol]) : 'Movimiento tarjeta Galicia',
        sourceRef: sourceRefCol ? String(rawRow[sourceRefCol]) : undefined
      })
    }

    return { rows, skippedCount }
  }
}

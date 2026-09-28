import * as XLSX from 'xlsx'
import type { ParsedStatementRowDto, ParseStatementResult } from '@shared/vaultEnvelope.types'
import type { StatementParser } from './index'

/**
 * DIFERIDO — sin archivo real de ejemplo (spec §5 Supuesto 1, §8 NO MEDIDO). Mapeo de columnas
 * asumido por analogía con el PDF de MP confirmado (Fecha, Descripción, Valor): no tiene AC
 * verificable todavía. No bloquea el resto de la feature (tasks.md Fase 6, US4).
 */
const HEADER_ALIASES = {
  date: ['fecha', 'date'],
  amount: ['valor', 'monto', 'amount'],
  description: ['descripción', 'descripcion', 'concepto', 'description'],
  sourceRef: ['id de la operación', 'id de la operacion', 'id', 'referencia']
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

function findColumn(headers: string[], aliases: string[]): string | undefined {
  return headers.find((header) => aliases.includes(normalizeHeader(header)))
}

function toIsoDate(rawDate: string): string | undefined {
  const ddmmyyyy = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(rawDate.trim())
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`
  const isoLike = /^\d{4}-\d{2}-\d{2}/.exec(rawDate.trim())
  if (isoLike) return isoLike[0]
  return undefined
}

function parseAmount(raw: string | number): number | undefined {
  if (typeof raw === 'number') return raw
  const normalized = raw.replace(/\$/g, '').trim().replace(/\./g, '').replace(',', '.')
  const value = Number(normalized)
  return Number.isFinite(value) ? value : undefined
}

export const mercadoPagoExcelParser: StatementParser = {
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
      const date = toIsoDate(String(rawRow[dateCol]))
      const amount = parseAmount(rawRow[amountCol])
      if (!date || amount === undefined) {
        skippedCount++
        continue
      }
      rows.push({
        date,
        amount,
        description: descriptionCol ? String(rawRow[descriptionCol]) : 'Movimiento Mercado Pago',
        sourceRef: sourceRefCol ? String(rawRow[sourceRefCol]) : undefined
      })
    }

    return { rows, skippedCount }
  }
}

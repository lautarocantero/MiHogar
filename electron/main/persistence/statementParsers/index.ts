import type { StatementFileFormat, StatementSource } from '@shared/vaultEnvelope.types'
import type { ParseStatementResult } from '@shared/vaultEnvelope.types'
import { mercadoPagoPdfParser } from './mercadoPagoPdfParser'
import { mercadoPagoExcelParser } from './mercadoPagoExcelParser'
import { galiciaTarjetaPdfParser } from './galiciaTarjetaPdfParser'
import { galiciaExcelParser } from './galiciaExcelParser'

export interface StatementParser {
  parse(fileBuffer: Buffer): Promise<ParseStatementResult>
}

export function resolveParser(
  source: StatementSource,
  format: StatementFileFormat
): StatementParser {
  if (source === 'MERCADO_PAGO' && format === 'PDF') return mercadoPagoPdfParser
  if (source === 'MERCADO_PAGO' && format === 'EXCEL_CSV') return mercadoPagoExcelParser
  if (source === 'GALICIA' && format === 'PDF') return galiciaTarjetaPdfParser
  if (source === 'GALICIA' && format === 'EXCEL_CSV') return galiciaExcelParser

  throw new Error(`Combinación de fuente/formato no soportada: ${source} / ${format}`)
}

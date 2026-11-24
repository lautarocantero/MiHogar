import type {
  ParseStatementResult,
  StatementFileFormat,
  StatementSource
} from '../typings/importStatements.types'
import { mercadoPagoPdfParser } from './mercadoPagoPdfParser'
import { mercadoPagoExcelParser } from './mercadoPagoExcelParser'
import { galiciaTarjetaPdfParser } from './galiciaTarjetaPdfParser'
import { galiciaExcelParser } from './galiciaExcelParser'

/** Parser de una fuente/formato. Corre en el navegador: recibe los bytes del archivo. */
export interface StatementParser {
  parse(fileData: Uint8Array): Promise<ParseStatementResult>
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

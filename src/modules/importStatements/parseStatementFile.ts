import { resolveParser } from './parsers'
import { StatementImportError } from './statementImportError'
import type {
  ParseStatementResult,
  StatementFileFormat,
  StatementSource
} from './typings/importStatements.types'

/**
 * Tope de tamaño: un resumen mensual real pesa decenas o cientos de KB. Archivos más grandes
 * casi seguro no son una boleta y parsearlos en el navegador puede colgar la pestaña.
 */
export const MAX_STATEMENT_FILE_MB = 15
export const MAX_STATEMENT_FILE_BYTES = MAX_STATEMENT_FILE_MB * 1024 * 1024

const EXTENSIONS_BY_FORMAT: Record<StatementFileFormat, string[]> = {
  PDF: ['.pdf'],
  EXCEL_CSV: ['.xlsx', '.xls', '.csv']
}

const MIME_TYPES_BY_FORMAT: Record<StatementFileFormat, string[]> = {
  PDF: ['application/pdf'],
  EXCEL_CSV: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv'
  ]
}

/** Valor del atributo `accept` del `<input type="file">` según el formato elegido. */
export function getAcceptAttribute(format: StatementFileFormat): string {
  return [...EXTENSIONS_BY_FORMAT[format], ...MIME_TYPES_BY_FORMAT[format]].join(',')
}

function hasExpectedExtension(fileName: string, format: StatementFileFormat): boolean {
  const lowerName = fileName.toLowerCase()
  return EXTENSIONS_BY_FORMAT[format].some((extension) => lowerName.endsWith(extension))
}

function toMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1)
}

function errorName(error: unknown): string {
  return error instanceof Error ? error.name : ''
}

/** Traduce los errores de pdf.js / SheetJS a mensajes para el usuario. */
function toStatementImportError(error: unknown, format: StatementFileFormat): StatementImportError {
  if (error instanceof StatementImportError) return error
  const name = errorName(error)
  if (name === 'PasswordException') return new StatementImportError('passwordProtected', {}, error)
  if (name === 'InvalidPDFException') return new StatementImportError('invalidPdf', {}, error)
  if (format === 'EXCEL_CSV') return new StatementImportError('invalidSpreadsheet', {}, error)
  return new StatementImportError('parseFailed', {}, error)
}

/**
 * Lee y parsea una boleta en el navegador (antes lo hacía el proceso main de Electron vía IPC).
 * Siempre rechaza con `StatementImportError` (mensaje traducido), nunca con un error crudo.
 */
export async function parseStatementFile(
  file: File,
  source: StatementSource,
  format: StatementFileFormat
): Promise<ParseStatementResult> {
  if (!hasExpectedExtension(file.name, format)) {
    throw new StatementImportError(`wrongFormat.${format}`)
  }
  if (file.size === 0) throw new StatementImportError('empty')
  if (file.size > MAX_STATEMENT_FILE_BYTES) {
    throw new StatementImportError('tooLarge', {
      sizeMb: toMb(file.size),
      maxMb: MAX_STATEMENT_FILE_MB
    })
  }

  let fileData: Uint8Array
  try {
    fileData = new Uint8Array(await file.arrayBuffer())
  } catch (error) {
    throw new StatementImportError('unreadable', {}, error)
  }

  let result: ParseStatementResult
  try {
    result = await resolveParser(source, format).parse(fileData)
  } catch (error) {
    throw toStatementImportError(error, format)
  }

  if (result.rows.length === 0) throw new StatementImportError('noRows')
  return result
}

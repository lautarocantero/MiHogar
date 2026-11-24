import { t } from '@/i18n'
import type { TranslateParams } from '@/i18n/types'

export type StatementImportErrorCode =
  | 'tooLarge'
  | 'empty'
  | 'wrongFormat.PDF'
  | 'wrongFormat.EXCEL_CSV'
  | 'unreadable'
  | 'invalidPdf'
  | 'passwordProtected'
  | 'invalidSpreadsheet'
  | 'parseFailed'
  | 'noRows'
  | 'accountNotFound'

/**
 * Error "esperable" de la carga de boletas: su `message` ya viene traducido y listo para
 * mostrarse (lo levanta `useLoader` tal cual). La causa técnica queda en `cause` para la consola.
 */
export class StatementImportError extends Error {
  readonly code: StatementImportErrorCode

  constructor(code: StatementImportErrorCode, params?: TranslateParams, cause?: unknown) {
    super(t(`importStatements.error.${code}`, params), { cause })
    this.name = 'StatementImportError'
    this.code = code
  }
}

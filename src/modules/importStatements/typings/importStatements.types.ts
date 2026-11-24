import type { MovementType } from '@/typings/domain/enums'

/**
 * Tipos propios del módulo (antes venían de `@shared/vaultEnvelope.types`, que describía el
 * contrato IPC con el proceso main). Desde la web app el parseo corre en el navegador, así que
 * el módulo ya no depende de ese contrato.
 */
export type StatementSource = 'MERCADO_PAGO' | 'GALICIA'
export type StatementFileFormat = 'EXCEL_CSV' | 'PDF'

export type ParsedStatementRowDto = {
  date: string
  amount: number
  description: string
  sourceRef?: string
}

export type ParseStatementResult = {
  rows: ParsedStatementRowDto[]
  skippedCount: number
}

export type PreviewRow = ParsedStatementRowDto & {
  rowId: string
  type: MovementType
  categoryId: string
  included: boolean
  likelyDuplicate: boolean
  invalid: boolean
}

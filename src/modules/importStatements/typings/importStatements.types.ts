import type { MovementType } from '@/typings/domain/enums'
import type { ParsedStatementRowDto } from '@shared/vaultEnvelope.types'

export type {
  StatementSource,
  StatementFileFormat,
  ParseStatementPayload,
  ParsedStatementRowDto,
  ParseStatementResult
} from '@shared/vaultEnvelope.types'

export type PreviewRow = ParsedStatementRowDto & {
  rowId: string
  type: MovementType
  categoryId: string
  included: boolean
  likelyDuplicate: boolean
  invalid: boolean
}

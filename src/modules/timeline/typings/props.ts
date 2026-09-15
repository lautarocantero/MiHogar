import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { FlowSummary, Movement } from '@/typings/domain/types'
import type { MovementType } from '@/typings/domain/enums'
import type { QuickAddFormValues } from '@/modules/quickAdd/typings/types'
import type { TimelineEntry } from './types'

export type TimelineSummaryCardsProps = {
  summary: FlowSummary
}

export type TimelineEntryCardProps = {
  entry: TimelineEntry
  onEdit: () => void
  onDelete: () => void
}

export type MovementFormFieldsProps = {
  register: UseFormRegister<QuickAddFormValues>
  errors: FieldErrors<QuickAddFormValues>
  type: MovementType
}

export type EditMovementFormProps = {
  movement: Movement
  onSubmit: (values: QuickAddFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type EditMovementDialogProps = {
  movement: Movement
  open: boolean
  onClose: () => void
}

export type DeleteMovementDialogProps = {
  movement: Movement
  open: boolean
  onClose: () => void
}

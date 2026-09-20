import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { SavingsGoal } from '@/typings/domain/types'
import type {
  AddSavingsFormValues,
  AddSavingsGoalFormValues,
  MonthSummaryItem,
  MonthlyEvolutionPoint,
  SavingsGoalView,
  SavingsInstrumentView,
  SavingsSummary
} from './types'

export type SavingsSummaryCardsProps = {
  summary: SavingsSummary
}

export type SavingsInstrumentRowProps = {
  instrument: SavingsInstrumentView
}

export type AddSavingsFormProps = {
  onSubmit: (values: AddSavingsFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddSavingsDialogProps = {
  open: boolean
  onClose: () => void
}

export type SavingsEvolutionChartProps = {
  points: MonthlyEvolutionPoint[]
}

export type MonthSummaryCardProps = {
  items: MonthSummaryItem[]
}

export type SavingsGoalRowProps = {
  goal: SavingsGoalView
  onEdit: (goal: SavingsGoalView) => void
  onDelete: (goal: SavingsGoalView) => void
}

export type SavingsGoalFormFieldsProps = {
  register: UseFormRegister<AddSavingsGoalFormValues>
  control: Control<AddSavingsGoalFormValues>
  errors: FieldErrors<AddSavingsGoalFormValues>
  selectedOwnerType: AddSavingsGoalFormValues['ownerType']
}

export type AddSavingsGoalFormProps = {
  onSubmit: (values: AddSavingsGoalFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddSavingsGoalDialogProps = {
  open: boolean
  onClose: () => void
}

export type EditSavingsGoalFormProps = AddSavingsGoalFormProps & {
  goal: SavingsGoal
}

export type EditSavingsGoalDialogProps = {
  goal: SavingsGoal
  open: boolean
  onClose: () => void
}

export type DeleteSavingsGoalDialogProps = {
  goal: SavingsGoal
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

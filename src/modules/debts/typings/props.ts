import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { Debt } from '@/typings/domain/types'
import type { AddDebtFormValues, DebtsSummary, DebtView } from './types'

export type DebtsSummaryCardsProps = {
  summary: DebtsSummary
}

export type DebtRowProps = {
  debt: DebtView
  onEdit: (debt: DebtView) => void
  onDelete: (debt: DebtView) => void
}

export type DebtFormFieldsProps = {
  register: UseFormRegister<AddDebtFormValues>
  control: Control<AddDebtFormValues>
  errors: FieldErrors<AddDebtFormValues>
  selectedOwnerType: AddDebtFormValues['ownerType']
  hasInstallments: boolean
  onToggleInstallments: (value: boolean) => void
}

export type AddDebtFormProps = {
  onSubmit: (values: AddDebtFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddDebtDialogProps = {
  open: boolean
  onClose: () => void
}

export type EditDebtFormProps = AddDebtFormProps & {
  debt: Debt
}

export type EditDebtDialogProps = {
  debt: Debt
  open: boolean
  onClose: () => void
}

export type DeleteDebtDialogProps = {
  debt: Debt
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

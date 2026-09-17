import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { Account } from '@/typings/domain/types'
import type { AccountType, OwnerType } from '@/typings/domain/enums'
import type { AccountView, AddAccountFormValues } from './types'

export type AccountCardProps = {
  account: AccountView
  onEdit: () => void
  onDelete: () => void
}

export type CreditCardInfoLineProps = {
  closingDay?: number
  dueDay?: number
}

export type AccountFormFieldsProps = {
  register: UseFormRegister<AddAccountFormValues>
  control: Control<AddAccountFormValues>
  errors: FieldErrors<AddAccountFormValues>
  selectedType: AccountType
  selectedOwnerType: OwnerType
}

export type AddAccountFormProps = {
  onSubmit: (values: AddAccountFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddAccountDialogProps = {
  open: boolean
  onClose: () => void
}

export type EditAccountFormProps = {
  account: Account
  onSubmit: (values: AddAccountFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type EditAccountDialogProps = {
  account: Account
  open: boolean
  onClose: () => void
}

export type DeleteAccountDialogProps = {
  account: Account
  open: boolean
  onClose: () => void
}

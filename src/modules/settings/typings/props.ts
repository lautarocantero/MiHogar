import type { AddMemberFormValues, ChangeHouseholdKeyFormValues } from './types'

export type HouseholdKeyFormProps = {
  onSubmit: (values: ChangeHouseholdKeyFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
  successMessage: string | null
}

export type AddMemberFormProps = {
  onSubmit: (values: AddMemberFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddMemberDialogProps = {
  open: boolean
  onClose: () => void
  onCreated?: (memberId: string) => void
}

export type FactoryResetDialogProps = {
  open: boolean
  onClose: () => void
}

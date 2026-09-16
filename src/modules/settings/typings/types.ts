import type { InferType } from 'yup'
import type { changeHouseholdKeyFormSchema } from '@/validation/changeHouseholdKeyFormSchema'
import type { addMemberFormSchema } from '@/validation/addMemberFormSchema'
import type { FactoryResetCategory } from './enums'

export type ChangeHouseholdKeyFormValues = InferType<typeof changeHouseholdKeyFormSchema>
export type AddMemberFormValues = InferType<typeof addMemberFormSchema>

export type UseChangeHouseholdKeyResult = {
  submit: (values: ChangeHouseholdKeyFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
  successMessage: string | null
}

export type UseAddMemberResult = {
  submit: (values: AddMemberFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseExportImportVaultResult = {
  exportBackup: () => void
  importBackup: () => void
  isLoading: boolean
  errorMessage: string | null
  message: string | null
}

export type UseReminderPreferenceResult = {
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
  isLoading: boolean
  errorMessage: string | null
}

export type UseFactoryResetResult = {
  submit: (categories: FactoryResetCategory[]) => void
  isSubmitting: boolean
  errorMessage: string | null
}

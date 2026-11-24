import type { InferType } from 'yup'
import type { changeHouseholdKeyFormSchema } from '@/validation/changeHouseholdKeyFormSchema'
import type { addMemberFormSchema } from '@/validation/addMemberFormSchema'
import type { UseRestoreVaultBackupResult } from '@/hooks/shared/typings/types'
import type { ReminderPermission } from '@/apis/remindersApi'
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
  /** Pide confirmación antes de reemplazar los datos de la cuenta. */
  requestImport: () => void
  confirmImport: () => void
  cancelImport: () => void
  isConfirmingImport: boolean
  restore: UseRestoreVaultBackupResult
  isLoading: boolean
  errorMessage: string | null
  message: string | null
}

export type UseReminderPreferenceResult = {
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
  leadDays: number
  setLeadDays: (leadDays: number) => void
  permission: ReminderPermission
  requestPermission: () => void
  isLoading: boolean
  errorMessage: string | null
}

export type UseFactoryResetResult = {
  submit: (categories: FactoryResetCategory[]) => void
  isSubmitting: boolean
  errorMessage: string | null
}

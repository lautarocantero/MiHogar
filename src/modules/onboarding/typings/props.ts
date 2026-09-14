import type { ReactNode } from 'react'
import type { CreateHouseholdKeyFormValues, UnlockFormValues } from './types'

export type VaultGateProps = {
  children: ReactNode
}

export type CreateHouseholdKeyFormProps = {
  onSubmit: (values: CreateHouseholdKeyFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UnlockFormProps = {
  onSubmit: (values: UnlockFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

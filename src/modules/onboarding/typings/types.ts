import type { z } from 'zod'
import type { createHouseholdKeyFormSchema } from '@/validation/createHouseholdKeyFormSchema'
import type { unlockFormSchema } from '@/validation/unlockFormSchema'

export type CreateHouseholdKeyFormValues = z.infer<typeof createHouseholdKeyFormSchema>
export type UnlockFormValues = z.infer<typeof unlockFormSchema>

export type UseCreateHouseholdResult = {
  submit: (values: CreateHouseholdKeyFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseUnlockVaultResult = {
  submit: (values: UnlockFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseEnterDemoModeResult = {
  enterDemo: () => void
  isEntering: boolean
}

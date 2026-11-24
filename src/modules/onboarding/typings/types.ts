import type { z } from 'zod'
import type { VaultStatus } from '@/store/vault/typings/enums'
import type { createHouseholdKeyFormSchema } from '@/validation/createHouseholdKeyFormSchema'
import type { unlockFormSchema } from '@/validation/unlockFormSchema'
import type {
  forgotPasswordFormSchema,
  newPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema
} from '@/validation/authFormSchemas'

export type CreateHouseholdKeyFormValues = z.infer<typeof createHouseholdKeyFormSchema>
export type UnlockFormValues = z.infer<typeof unlockFormSchema>
export type SignInFormValues = z.infer<typeof signInFormSchema>
export type SignUpFormValues = z.infer<typeof signUpFormSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>
export type NewPasswordFormValues = z.infer<typeof newPasswordFormSchema>

type SubmitResult<TValues> = {
  submit: (values: TValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseCreateHouseholdResult = SubmitResult<CreateHouseholdKeyFormValues>

export type UseUnlockVaultResult = SubmitResult<UnlockFormValues>

export type UseSignInResult = SubmitResult<SignInFormValues> & {
  /** Borra el error visible (al cambiar de pantalla). */
  reset: () => void
}

/*
 * EMAILS DESACTIVADOS (todavía no hay envío de mails): al reactivar la confirmación de cuenta
 * se vuelven a sumar `pendingConfirmationEmail`, `resend`, `isResending`, `resendMessage` y
 * `resendErrorMessage` (los usa `EmailSentNotice`).
 */
export type UseSignUpResult = SubmitResult<SignUpFormValues> & {
  /** Borra el error visible (al cambiar de pantalla). */
  reset: () => void
}

export type UseForgotPasswordResult = SubmitResult<ForgotPasswordFormValues> & {
  sentToEmail: string | null
  resetSent: () => void
}

export type UseResetPasswordResult = SubmitResult<NewPasswordFormValues>

export type UseEnterDemoModeResult = {
  enterDemo: () => void
  isEntering: boolean
}

export type UseVaultGateStatusResult = {
  status: VaultStatus
  /** Error al consultar si la cuenta tiene datos (sin red, tabla sin crear...). */
  errorMessage: string | null
  isChecking: boolean
  retry: () => void
}

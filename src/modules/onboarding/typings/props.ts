import type { ReactNode } from 'react'
import type {
  CreateHouseholdKeyFormValues,
  ForgotPasswordFormValues,
  NewPasswordFormValues,
  SignInFormValues,
  SignUpFormValues,
  UnlockFormValues
} from './types'

export type AuthGateProps = {
  children: ReactNode
}

export type VaultGateProps = {
  children: ReactNode
}

type FormSubmitProps<TValues> = {
  onSubmit: (values: TValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type CreateHouseholdKeyFormProps = FormSubmitProps<CreateHouseholdKeyFormValues>

export type UnlockFormProps = FormSubmitProps<UnlockFormValues> & {
  noticeMessage?: string | null
}

export type SignInFormProps = FormSubmitProps<SignInFormValues> & {
  defaultEmail: string
  noticeMessage?: string | null
  onGoToSignUp: () => void
  /** Opcional mientras no haya envío de mails (sin él no se muestra el link). */
  onGoToForgotPassword?: () => void
}

export type SignUpFormProps = FormSubmitProps<SignUpFormValues> & {
  defaultEmail: string
  onGoToSignIn: () => void
}

export type ForgotPasswordFormProps = FormSubmitProps<ForgotPasswordFormValues> & {
  defaultEmail: string
  onGoToSignIn: () => void
}

export type NewPasswordFormProps = FormSubmitProps<NewPasswordFormValues>

export type EmailSentNoticeProps = {
  title: string
  description: string
  onBack: () => void
  onResend?: () => void
  isResending?: boolean
  resendMessage?: string | null
  resendErrorMessage?: string | null
}

export type StatusMessageCardProps = {
  title: string
  description: string
  severity: 'error' | 'warning' | 'info'
  actionLabel?: string
  onAction?: () => void
  isActionLoading?: boolean
}

export type DemoModeButtonProps = {
  onClick: () => void
  isLoading: boolean
}

export type AuthPageLayoutProps = {
  /** Sin `onDemoClick` no se muestra el botón de demo. */
  onDemoClick?: () => void
  isDemoLoading?: boolean
  footer?: ReactNode
  children: ReactNode
}

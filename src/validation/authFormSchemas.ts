import { z } from 'zod'

/**
 * Formularios de la cuenta (Supabase Auth). Los mensajes son claves de i18n: el
 * componente los traduce con `t()`.
 */
const MIN_ACCOUNT_PASSWORD_LENGTH = 8
const MAX_EMAIL_LENGTH = 254
const MAX_PASSWORD_LENGTH = 72

const emailField = z
  .string()
  .trim()
  .min(1, 'auth.validation.emailRequired')
  .max(MAX_EMAIL_LENGTH, 'auth.validation.emailInvalid')
  .email('auth.validation.emailInvalid')

const newPasswordField = z
  .string()
  .min(MIN_ACCOUNT_PASSWORD_LENGTH, 'auth.validation.passwordTooShort')
  .max(MAX_PASSWORD_LENGTH, 'auth.validation.passwordTooLong')

export const signInFormSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'auth.validation.passwordRequired')
})

export const signUpFormSchema = z
  .object({
    email: emailField,
    password: newPasswordField,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.validation.passwordsDontMatch',
    path: ['confirmPassword']
  })

export const forgotPasswordFormSchema = z.object({
  email: emailField
})

export const newPasswordFormSchema = z
  .object({
    password: newPasswordField,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.validation.passwordsDontMatch',
    path: ['confirmPassword']
  })

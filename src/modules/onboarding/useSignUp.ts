import { useCallback, useRef, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { signUpThunk } from '@/store/auth/authThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { sensitive } from '@/utils/sensitive'
import { useT } from '@/i18n'
import type { SignUpFormValues, UseSignUpResult } from './typings/types'

/*
 * EMAILS DESACTIVADOS (todavía no hay envío de mails): la cuenta tiene que quedar activa al
 * crearla ("Confirm email" apagado en Supabase). Para reactivar la pantalla "Revisá tu email"
 * hay que volver a guardar `pendingConfirmationEmail` cuando `needsEmailConfirmation` es true
 * y exponer `resend` (usa `resendSignUpEmailThunk`), `isResending`, `resendMessage` y
 * `resendErrorMessage` para `EmailSentNotice`.
 */
export function useSignUp(): UseSignUpResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run, reset: resetLoader } = useLoader()
  const [confirmationBlockedMessage, setConfirmationBlockedMessage] = useState<string | null>(null)
  // El botón se deshabilita recién en el próximo render: esto corta el doble envío.
  const isInFlightRef = useRef(false)

  const submit = useCallback(
    (values: SignUpFormValues) => {
      if (isInFlightRef.current) return
      isInFlightRef.current = true
      setConfirmationBlockedMessage(null)
      run(
        () =>
          dispatch(
            signUpThunk(sensitive({ email: values.email, password: values.password }))
          ).unwrap(),
        t('auth.errors.generic')
      )
        .then((result) => {
          // Si Supabase igual pide confirmar, se avisa en vez de mostrar "revisá tu email".
          if (result?.needsEmailConfirmation) {
            setConfirmationBlockedMessage(t('auth.errors.confirmationRequired'))
          }
        })
        .finally(() => {
          isInFlightRef.current = false
        })
    },
    [dispatch, run, t]
  )

  const reset = useCallback(() => {
    resetLoader()
    setConfirmationBlockedMessage(null)
  }, [resetLoader])

  return {
    submit,
    isSubmitting: isLoading,
    errorMessage: error ?? confirmationBlockedMessage,
    reset
  }
}

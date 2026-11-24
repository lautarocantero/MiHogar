// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { sendPasswordResetThunk } from '@/store/auth/authThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { useT } from '@/i18n'
import type { ForgotPasswordFormValues, UseForgotPasswordResult } from './typings/types'

export function useForgotPassword(): UseForgotPasswordResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run } = useLoader()
  const [sentToEmail, setSentToEmail] = useState<string | null>(null)

  const submit = useCallback(
    (values: ForgotPasswordFormValues) => {
      run(
        () => dispatch(sendPasswordResetThunk(values.email)).unwrap(),
        t('auth.errors.generic')
      ).then((result) => {
        if (result) setSentToEmail(values.email.trim())
      })
    },
    [dispatch, run, t]
  )

  const resetSent = useCallback(() => setSentToEmail(null), [])

  return { submit, isSubmitting: isLoading, errorMessage: error, sentToEmail, resetSent }
}

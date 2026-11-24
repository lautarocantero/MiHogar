// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { completePasswordRecoveryThunk } from '@/store/auth/authThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { sensitive } from '@/utils/sensitive'
import { useT } from '@/i18n'
import type { NewPasswordFormValues, UseResetPasswordResult } from './typings/types'

export function useResetPassword(): UseResetPasswordResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: NewPasswordFormValues) => {
      run(
        () => dispatch(completePasswordRecoveryThunk(sensitive(values.password))).unwrap(),
        t('auth.errors.generic')
      )
    },
    [dispatch, run, t]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

import { useCallback, useRef } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { signInThunk } from '@/store/auth/authThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { sensitive } from '@/utils/sensitive'
import { useT } from '@/i18n'
import type { SignInFormValues, UseSignInResult } from './typings/types'

export function useSignIn(): UseSignInResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run, reset } = useLoader()
  // El botón se deshabilita recién en el próximo render: esto corta el doble envío.
  const isInFlightRef = useRef(false)

  const submit = useCallback(
    (values: SignInFormValues) => {
      if (isInFlightRef.current) return
      isInFlightRef.current = true
      run(
        () =>
          dispatch(
            signInThunk(sensitive({ email: values.email, password: values.password }))
          ).unwrap(),
        t('auth.errors.generic')
      ).finally(() => {
        isInFlightRef.current = false
      })
    },
    [dispatch, run, t]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error, reset }
}

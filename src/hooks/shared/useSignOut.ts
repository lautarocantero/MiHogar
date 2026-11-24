import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { signOutThunk } from '@/store/auth/authThunks'
import { useT } from '@/i18n'
import { useLoader } from './useLoader'
import type { UseSignOutResult } from './typings/types'

/** Cierra la sesión de la cuenta y olvida la clave del hogar de este dispositivo. */
export function useSignOut(): UseSignOutResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run } = useLoader()

  const signOut = useCallback(() => {
    run(() => dispatch(signOutThunk()).unwrap(), t('auth.errors.signOutFailed'))
  }, [dispatch, run, t])

  return { signOut, isSigningOut: isLoading, errorMessage: error }
}

import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { unlockVaultThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import type { UnlockFormValues, UseUnlockVaultResult } from './typings/types'

export function useUnlockVault(): UseUnlockVaultResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: UnlockFormValues) => {
      run(
        () => dispatch(unlockVaultThunk(values.householdKey)).unwrap(),
        'La clave del hogar no es correcta'
      )
    },
    [dispatch, run]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

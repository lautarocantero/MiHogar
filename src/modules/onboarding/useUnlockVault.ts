import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { unlockVaultThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { sensitive } from '@/utils/sensitive'
import { useT } from '@/i18n'
import type { UnlockFormValues, UseUnlockVaultResult } from './typings/types'

export function useUnlockVault(): UseUnlockVaultResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: UnlockFormValues) => {
      run(
        () => dispatch(unlockVaultThunk(sensitive(values.householdKey))).unwrap(),
        t('vaultErrors.invalidKey')
      )
    },
    [dispatch, run, t]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

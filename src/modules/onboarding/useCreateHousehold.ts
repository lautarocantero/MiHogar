import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { createVaultThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { sensitive } from '@/utils/sensitive'
import { useT } from '@/i18n'
import type { CreateHouseholdKeyFormValues, UseCreateHouseholdResult } from './typings/types'

export function useCreateHousehold(): UseCreateHouseholdResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: CreateHouseholdKeyFormValues) => {
      run(
        () => dispatch(createVaultThunk(sensitive(values.householdKey))).unwrap(),
        t('onboarding.createFailed')
      )
    },
    [dispatch, run, t]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

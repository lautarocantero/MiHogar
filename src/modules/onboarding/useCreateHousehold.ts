import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { createVaultThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import type { CreateHouseholdKeyFormValues, UseCreateHouseholdResult } from './typings/types'

export function useCreateHousehold(): UseCreateHouseholdResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: CreateHouseholdKeyFormValues) => {
      run(
        () => dispatch(createVaultThunk(values.householdKey)).unwrap(),
        'No se pudo crear el archivo de datos'
      )
    },
    [dispatch, run]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

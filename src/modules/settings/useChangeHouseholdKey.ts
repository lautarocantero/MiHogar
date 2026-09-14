import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { changeHouseholdKeyThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import type { ChangeHouseholdKeyFormValues, UseChangeHouseholdKeyResult } from './typings/types'

export function useChangeHouseholdKey(): UseChangeHouseholdKeyResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const submit = useCallback(
    (values: ChangeHouseholdKeyFormValues) => {
      setSuccessMessage(null)
      run(
        () =>
          dispatch(
            changeHouseholdKeyThunk({ currentKey: values.currentKey, newKey: values.newKey })
          ).unwrap(),
        'No se pudo cambiar la clave del hogar'
      ).then((result) => {
        if (result !== undefined) {
          setSuccessMessage('Guardamos la nueva clave del hogar.')
        }
      })
    },
    [dispatch, run]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error, successMessage }
}

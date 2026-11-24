import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { changeHouseholdKeyThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { sensitive } from '@/utils/sensitive'
import { useT } from '@/i18n'
import type { ChangeHouseholdKeyFormValues, UseChangeHouseholdKeyResult } from './typings/types'

export function useChangeHouseholdKey(): UseChangeHouseholdKeyResult {
  const t = useT()
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const submit = useCallback(
    (values: ChangeHouseholdKeyFormValues) => {
      setSuccessMessage(null)
      run(
        () =>
          dispatch(
            changeHouseholdKeyThunk(
              sensitive({ currentKey: values.currentKey, newKey: values.newKey })
            )
          ).unwrap(),
        t('settings.householdKey.changeFailed')
      ).then((result) => {
        if (result !== undefined) {
          setSuccessMessage(t('settings.householdKey.changed'))
        }
      })
    },
    [dispatch, run, t]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error, successMessage }
}

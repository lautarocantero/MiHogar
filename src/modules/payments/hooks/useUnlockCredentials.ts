import { useCallback, useState } from 'react'
import { verifyHouseholdKey } from '@/apis/vaultApi'
import { useLoader } from '@/hooks/shared/useLoader'
import type { UnlockCredentialsFormValues, UseUnlockCredentialsResult } from '../typings/types'

export function useUnlockCredentials(): UseUnlockCredentialsResult {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: UnlockCredentialsFormValues) => {
      run(async () => {
        const isValid = await verifyHouseholdKey(values.householdKey)
        if (!isValid) {
          throw new Error('La clave del hogar no es correcta')
        }
        setIsUnlocked(true)
      }, 'No se pudo verificar la clave del hogar')
    },
    [run]
  )

  const hide = useCallback(() => setIsUnlocked(false), [])

  return { isUnlocked, submit, isVerifying: isLoading, errorMessage: error, hide }
}

import { useCallback, useState } from 'react'
import { verifyHouseholdKey } from '@/apis/vaultApi'
import { useLoader } from '@/hooks/shared/useLoader'
import type { UnlockCredentialsFormValues, UseUnlockCredentialsResult } from '../typings/types'

/**
 * Módulo en memoria: sobrevive a que React Router desmonte la página al
 * navegar, pero se limpia solo al reiniciar la app (no queda en disco).
 */
const unlockedPaymentIds = new Set<string>()

export function useUnlockCredentials(paymentId: string): UseUnlockCredentialsResult {
  const [isUnlocked, setIsUnlocked] = useState(() => unlockedPaymentIds.has(paymentId))
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: UnlockCredentialsFormValues) => {
      run(async () => {
        const isValid = await verifyHouseholdKey(values.householdKey)
        if (!isValid) {
          throw new Error('La clave del hogar no es correcta')
        }
        unlockedPaymentIds.add(paymentId)
        setIsUnlocked(true)
      }, 'No se pudo verificar la clave del hogar')
    },
    [run, paymentId]
  )

  const hide = useCallback(() => {
    unlockedPaymentIds.delete(paymentId)
    setIsUnlocked(false)
  }, [paymentId])

  return { isUnlocked, submit, isVerifying: isLoading, errorMessage: error, hide }
}

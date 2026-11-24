import { useCallback, useState } from 'react'
import { verifyHouseholdKey } from '@/apis/vaultApi'
import { AppError } from '@/apis/cloud/errors'
import { getVaultSession } from '@/apis/cloud/vaultSession'
import type { VaultSession } from '@/apis/cloud/vaultSession'
import { useLoader } from '@/hooks/shared/useLoader'
import { useT } from '@/i18n'
import type { UnlockCredentialsFormValues, UseUnlockCredentialsResult } from '../typings/types'

/**
 * Pagos con las credenciales a la vista, por sesión del vault. Vive en memoria y sobrevive
 * a que React Router desmonte la página al navegar; al bloquear, cerrar sesión o cambiar
 * la clave la sesión es otra (o no hay), así que todo vuelve a quedar oculto.
 */
const unlockedPaymentIdsBySession = new WeakMap<VaultSession, Set<string>>()

function getUnlockedPaymentIds(): Set<string> | null {
  const session = getVaultSession()
  if (!session) return null
  let unlocked = unlockedPaymentIdsBySession.get(session)
  if (!unlocked) {
    unlocked = new Set<string>()
    unlockedPaymentIdsBySession.set(session, unlocked)
  }
  return unlocked
}

export function useUnlockCredentials(paymentId: string): UseUnlockCredentialsResult {
  const t = useT()
  const [isUnlocked, setIsUnlocked] = useState(
    () => getUnlockedPaymentIds()?.has(paymentId) ?? false
  )
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: UnlockCredentialsFormValues) => {
      run(async () => {
        const isValid = await verifyHouseholdKey(values.householdKey)
        if (!isValid) {
          throw new AppError('vaultErrors.wrongHouseholdKey')
        }
        getUnlockedPaymentIds()?.add(paymentId)
        setIsUnlocked(true)
      }, t('vaultErrors.verifyKeyFailed'))
    },
    [run, paymentId, t]
  )

  const hide = useCallback(() => {
    getUnlockedPaymentIds()?.delete(paymentId)
    setIsUnlocked(false)
  }, [paymentId])

  return { isUnlocked, submit, isVerifying: isLoading, errorMessage: error, hide }
}

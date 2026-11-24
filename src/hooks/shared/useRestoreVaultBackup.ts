import { useCallback, useState } from 'react'
import type { VaultEnvelope } from '@shared/vaultEnvelope.types'
import { useAppDispatch } from '@/store/hooks'
import { restoreVaultThunk } from '@/store/vault/vaultThunks'
import { pickVaultBackupFile } from '@/apis/vaultApi'
import { useT } from '@/i18n'
import { sensitive } from '@/utils/sensitive'
import { useHandleError } from './useHandleError'
import type { UseRestoreVaultBackupResult } from './typings/types'

type UseRestoreVaultBackupOptions = {
  /** `true` para reemplazar el vault que ya tiene la cuenta (Configuración). */
  replace: boolean
  onRestored?: () => void
}

/**
 * Importar un respaldo `.dat`: elegir el archivo → pedir su clave del hogar → verificar
 * que la clave lo abre → subirlo como vault de la cuenta.
 */
export function useRestoreVaultBackup({
  replace,
  onRestored
}: UseRestoreVaultBackupOptions): UseRestoreVaultBackupResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const handleError = useHandleError()
  const [envelope, setEnvelope] = useState<VaultEnvelope | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pickErrorMessage, setPickErrorMessage] = useState<string | null>(null)

  const pickBackup = useCallback(() => {
    setPickErrorMessage(null)
    setErrorMessage(null)
    pickVaultBackupFile()
      .then((picked) => {
        if (picked) setEnvelope(picked)
      })
      .catch((error: unknown) => {
        setPickErrorMessage(handleError(error, t('vaultErrors.invalidBackup')))
      })
  }, [handleError, t])

  const submitKey = useCallback(
    (householdKey: string) => {
      if (!envelope) return
      setIsRestoring(true)
      setErrorMessage(null)
      dispatch(restoreVaultThunk(sensitive({ envelope, householdKey, replace })))
        .unwrap()
        .then(() => {
          setEnvelope(null)
          onRestored?.()
        })
        .catch((error: unknown) => {
          setErrorMessage(handleError(error, t('onboarding.restoreFailed')))
        })
        .finally(() => setIsRestoring(false))
    },
    [dispatch, envelope, replace, onRestored, handleError, t]
  )

  const cancel = useCallback(() => {
    setEnvelope(null)
    setErrorMessage(null)
  }, [])

  return {
    pickBackup,
    isAwaitingKey: envelope !== null,
    submitKey,
    cancel,
    isRestoring,
    errorMessage,
    pickErrorMessage
  }
}

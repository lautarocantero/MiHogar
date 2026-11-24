import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectPendingExit } from '@/store/ui/uiSelectors'
import { PendingExitReason } from '@/store/ui/typings/enums'
import { resolvePendingExitThunk } from '@/store/auth/authThunks'
import { exportVaultBackupThunk } from '@/store/vault/vaultThunks'
import { AppError } from '@/apis/cloud/errors'
import { useT } from '@/i18n'
import { useLoader } from './useLoader'
import type { UsePendingExitResolutionResult } from './typings/types'

/** Diálogo "Tenés cambios sin guardar" (cerrar sesión, bloquear, sesión vencida). */
export function usePendingExitResolution(): UsePendingExitResolutionResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const pendingExit = useAppSelector(selectPendingExit)
  const { isLoading, error, run } = useLoader()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!pendingExit) setMessage(null)
  }, [pendingExit])

  const canRetry =
    pendingExit === PendingExitReason.SIGN_OUT || pendingExit === PendingExitReason.LOCK

  const retry = useCallback(() => {
    setMessage(null)
    run(async () => {
      const done = await dispatch(resolvePendingExitThunk('retry')).unwrap()
      if (!done) throw new AppError('sync.unsaved.retryFailed')
    }, t('sync.unsaved.retryFailed'))
  }, [dispatch, run, t])

  const discard = useCallback(() => {
    setMessage(null)
    run(
      () => dispatch(resolvePendingExitThunk('discard')).unwrap(),
      t('auth.errors.signOutFailed')
    )
  }, [dispatch, run, t])

  const exportBackup = useCallback(() => {
    setMessage(null)
    run(() => dispatch(exportVaultBackupThunk()).unwrap(), t('sync.unsaved.exportFailed')).then(
      (fileName) => {
        if (fileName) setMessage(t('sync.unsaved.exported', { fileName }))
      }
    )
  }, [dispatch, run, t])

  return {
    pendingExit,
    canRetry,
    retry,
    discard,
    exportBackup,
    isWorking: isLoading,
    errorMessage: error,
    message
  }
}

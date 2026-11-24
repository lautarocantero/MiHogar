import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectPendingExit, selectSaveStatus } from '@/store/ui/uiSelectors'
import { selectVaultStatus } from '@/store/vault/vaultSelectors'
import { SaveStatus } from '@/store/ui/typings/enums'
import { VaultStatus } from '@/store/vault/typings/enums'
import {
  applyRemoteChangesThunk,
  exportVaultBackupThunk,
  keepLocalChangesThunk
} from '@/store/vault/vaultThunks'
import { useT } from '@/i18n'
import { useLoader } from './useLoader'
import type { UseSyncConflictResolutionResult } from './typings/types'

/** Diálogo "Otro dispositivo guardó cambios": elegir versión o descargar la propia. */
export function useSyncConflictResolution(): UseSyncConflictResolutionResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const saveStatus = useAppSelector(selectSaveStatus)
  const vaultStatus = useAppSelector(selectVaultStatus)
  const pendingExit = useAppSelector(selectPendingExit)
  const { isLoading, error, run } = useLoader()
  const [message, setMessage] = useState<string | null>(null)

  // El diálogo de cambios sin guardar (sesión vencida, salir) tiene prioridad.
  const isOpen =
    vaultStatus === VaultStatus.UNLOCKED &&
    saveStatus === SaveStatus.CONFLICT &&
    pendingExit === null

  useEffect(() => {
    if (!isOpen) setMessage(null)
  }, [isOpen])

  const keepLocal = useCallback(() => {
    setMessage(null)
    run(() => dispatch(keepLocalChangesThunk()).unwrap(), t('sync.conflict.keepLocalFailed'))
  }, [dispatch, run, t])

  const applyRemote = useCallback(() => {
    setMessage(null)
    run(() => dispatch(applyRemoteChangesThunk()).unwrap(), t('sync.conflict.useRemoteFailed'))
  }, [dispatch, run, t])

  const exportLocal = useCallback(() => {
    setMessage(null)
    run(() => dispatch(exportVaultBackupThunk()).unwrap(), t('sync.unsaved.exportFailed')).then(
      (fileName) => {
        if (fileName) setMessage(t('sync.unsaved.exported', { fileName }))
      }
    )
  }, [dispatch, run, t])

  return {
    isOpen,
    keepLocal,
    applyRemote,
    exportLocal,
    isWorking: isLoading,
    errorMessage: error,
    message
  }
}

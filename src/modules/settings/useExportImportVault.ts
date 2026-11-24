import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { exportVaultBackupThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { useRestoreVaultBackup } from '@/hooks/shared/useRestoreVaultBackup'
import { useT } from '@/i18n'
import type { UseExportImportVaultResult } from './typings/types'

export function useExportImportVault(): UseExportImportVaultResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, error, run } = useLoader()
  const [message, setMessage] = useState<string | null>(null)
  const [isConfirmingImport, setIsConfirmingImport] = useState(false)

  const restore = useRestoreVaultBackup({
    replace: true,
    onRestored: () => setMessage(t('settingsCloud.backup.imported'))
  })

  const exportBackup = useCallback(() => {
    setMessage(null)
    run(
      () => dispatch(exportVaultBackupThunk()).unwrap(),
      t('settingsCloud.backup.exportFailed')
    ).then((fileName) => {
      if (fileName) {
        setMessage(t('settingsCloud.backup.exported', { fileName }))
      }
    })
  }, [dispatch, run, t])

  const requestImport = useCallback(() => {
    setMessage(null)
    setIsConfirmingImport(true)
  }, [])

  const { pickBackup } = restore
  const confirmImport = useCallback(() => {
    setIsConfirmingImport(false)
    pickBackup()
  }, [pickBackup])

  const cancelImport = useCallback(() => setIsConfirmingImport(false), [])

  return {
    exportBackup,
    requestImport,
    confirmImport,
    cancelImport,
    isConfirmingImport,
    restore,
    isLoading,
    errorMessage: error ?? restore.pickErrorMessage,
    message
  }
}

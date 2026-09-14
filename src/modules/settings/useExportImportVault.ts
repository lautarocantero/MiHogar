import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { exportVaultBackupThunk, importVaultBackupThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import type { UseExportImportVaultResult } from './typings/types'

export function useExportImportVault(): UseExportImportVaultResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()
  const [message, setMessage] = useState<string | null>(null)

  const exportBackup = useCallback(() => {
    setMessage(null)
    run(() => dispatch(exportVaultBackupThunk()).unwrap(), 'No se pudo exportar el respaldo').then(
      (filePath) => {
        if (filePath) {
          setMessage(`Guardamos el respaldo en ${filePath}`)
        }
      }
    )
  }, [dispatch, run])

  const importBackup = useCallback(() => {
    setMessage(null)
    run(() => dispatch(importVaultBackupThunk()).unwrap(), 'No se pudo importar el respaldo').then(
      (didImport) => {
        if (didImport) {
          setMessage(
            'Importamos el respaldo. Vas a tener que ingresar la clave del hogar de nuevo.'
          )
        }
      }
    )
  }, [dispatch, run])

  return { exportBackup, importBackup, isLoading, errorMessage: error, message }
}

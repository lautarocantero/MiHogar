import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { syncGithubThunk } from '@/store/tasks/tasksThunks'
import { showToast, setErrorMessage } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'

export function useSyncGithub(): { sync: () => void; isSyncing: boolean } {
  const dispatch = useAppDispatch()
  const { isLoading, run } = useLoader()

  const sync = useCallback(() => {
    run(async () => {
      try {
        const report = await dispatch(syncGithubThunk()).unwrap()
        dispatch(
          showToast(
            `Sync: ${report.discovered} descubiertos, ${report.refreshed} refrescados, ${report.moved} movidos` +
              (report.errors.length > 0 ? ` (${report.errors.length} errores)` : '')
          )
        )
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo sincronizar con GitHub'
        dispatch(setErrorMessage(message))
      }
    }, 'No se pudo sincronizar con GitHub')
  }, [dispatch, run])

  return { sync, isSyncing: isLoading }
}

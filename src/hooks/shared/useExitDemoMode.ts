import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { exitDemoModeThunk } from '@/store/vault/vaultThunks'
import { useLoader } from './useLoader'
import type { UseExitDemoModeResult } from './typings/types'

export function useExitDemoMode(): UseExitDemoModeResult {
  const dispatch = useAppDispatch()
  const { isLoading, run } = useLoader()

  const exitDemo = useCallback(() => {
    run(() => dispatch(exitDemoModeThunk()).unwrap(), 'No se pudo salir de la demo')
  }, [dispatch, run])

  return { exitDemo, isExiting: isLoading }
}

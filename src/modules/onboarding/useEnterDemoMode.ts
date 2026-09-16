import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { enterDemoModeThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import type { UseEnterDemoModeResult } from './typings/types'

export function useEnterDemoMode(): UseEnterDemoModeResult {
  const dispatch = useAppDispatch()
  const { isLoading, run } = useLoader()

  const enterDemo = useCallback(() => {
    run(() => dispatch(enterDemoModeThunk()).unwrap(), 'No se pudo iniciar la demo')
  }, [dispatch, run])

  return { enterDemo, isEntering: isLoading }
}

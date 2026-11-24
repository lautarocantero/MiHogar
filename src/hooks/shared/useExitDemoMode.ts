import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { exitDemoModeThunk } from '@/store/vault/vaultThunks'
import { t } from '@/i18n'
import { useLoader } from './useLoader'
import type { UseExitDemoModeResult } from './typings/types'

export function useExitDemoMode(): UseExitDemoModeResult {
  const dispatch = useAppDispatch()
  const { isLoading, run } = useLoader()

  const exitDemo = useCallback(() => {
    run(() => dispatch(exitDemoModeThunk()).unwrap(), t('layout.exitDemoFailed'))
  }, [dispatch, run])

  return { exitDemo, isExiting: isLoading }
}

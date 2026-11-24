import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { enterDemoModeThunk } from '@/store/vault/vaultThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { useT } from '@/i18n'
import type { UseEnterDemoModeResult } from './typings/types'

export function useEnterDemoMode(): UseEnterDemoModeResult {
  const dispatch = useAppDispatch()
  const t = useT()
  const { isLoading, run } = useLoader()

  const enterDemo = useCallback(() => {
    run(() => dispatch(enterDemoModeThunk()).unwrap(), t('onboarding.demoFailed'))
  }, [dispatch, run, t])

  return { enterDemo, isEntering: isLoading }
}

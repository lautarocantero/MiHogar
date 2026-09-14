import { useCallback, useEffect, useState } from 'react'
import { getPreferences, setPreferences } from '@/apis/preferencesApi'
import { useLoader } from '@/hooks/shared/useLoader'
import type { UseReminderPreferenceResult } from './typings/types'

export function useReminderPreference(): UseReminderPreferenceResult {
  const [isEnabled, setIsEnabledState] = useState(true)
  const { isLoading, error, run } = useLoader()

  useEffect(() => {
    run(getPreferences, 'No se pudo cargar la preferencia de recordatorios').then((preferences) => {
      if (preferences) {
        setIsEnabledState(preferences.remindersEnabled)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setEnabled = useCallback(
    (nextEnabled: boolean) => {
      setIsEnabledState(nextEnabled)
      run(async () => {
        const currentPreferences = await getPreferences()
        await setPreferences({ ...currentPreferences, remindersEnabled: nextEnabled })
      }, 'No se pudo guardar la preferencia de recordatorios')
    },
    [run]
  )

  return { isEnabled, setEnabled, isLoading, errorMessage: error }
}

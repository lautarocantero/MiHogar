import { useCallback, useEffect, useState } from 'react'
import { getPreferences, setPreferences } from '@/apis/preferencesApi'
import { getReminderPermission, requestReminderPermission } from '@/apis/remindersApi'
import type { ReminderPermission } from '@/apis/remindersApi'
import { useLoader } from '@/hooks/shared/useLoader'
import { useT } from '@/i18n'
import type { UseReminderPreferenceResult } from './typings/types'

export function useReminderPreference(): UseReminderPreferenceResult {
  const t = useT()
  const [isEnabled, setIsEnabledState] = useState(true)
  const [leadDays, setLeadDaysState] = useState(1)
  const [permission, setPermission] = useState<ReminderPermission>(() => getReminderPermission())
  const { isLoading, error, run } = useLoader()

  useEffect(() => {
    run(getPreferences, t('reminders.loadFailed')).then((preferences) => {
      if (preferences) {
        setIsEnabledState(preferences.remindersEnabled)
        setLeadDaysState(preferences.reminderLeadDays)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestPermission = useCallback(() => {
    requestReminderPermission().then(setPermission)
  }, [])

  const setEnabled = useCallback(
    (nextEnabled: boolean) => {
      setIsEnabledState(nextEnabled)
      // El permiso se pide desde el click del usuario (si no, algunos navegadores lo ignoran).
      if (nextEnabled && getReminderPermission() === 'default') {
        requestPermission()
      }
      run(async () => {
        const currentPreferences = await getPreferences()
        await setPreferences({ ...currentPreferences, remindersEnabled: nextEnabled })
      }, t('reminders.saveFailed'))
    },
    [run, requestPermission, t]
  )

  const setLeadDays = useCallback(
    (nextLeadDays: number) => {
      setLeadDaysState(nextLeadDays)
      run(async () => {
        const currentPreferences = await getPreferences()
        await setPreferences({ ...currentPreferences, reminderLeadDays: nextLeadDays })
      }, t('reminders.saveFailed'))
    },
    [run, t]
  )

  return {
    isEnabled,
    setEnabled,
    leadDays,
    setLeadDays,
    permission,
    requestPermission,
    isLoading,
    errorMessage: error
  }
}

import { useMemo } from 'react'
import { format } from 'date-fns'
import { getDateFnsLocale, useI18n } from '@/i18n'

export function useTodayLabel(): string {
  const { locale, t } = useI18n()
  return useMemo(() => {
    const label = format(new Date(), t('layout.todayFormat'), { locale: getDateFnsLocale(locale) })
    return label.charAt(0).toUpperCase() + label.slice(1)
  }, [locale, t])
}

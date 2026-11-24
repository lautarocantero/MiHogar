import { differenceInCalendarDays, format, isTomorrow, isToday, parseISO } from 'date-fns'
import { getDateFnsLocale, t } from '@/i18n'

/** Verbo con el que arranca la etiqueta de vencimiento ("Vence…", "Entra…", "Próxima cuota vence…"). */
export type DueLabelVerb = 'due' | 'incoming' | 'nextInstallment'

export function formatDayMonth(isoDate: string): { day: string; month: string } {
  const date = parseISO(isoDate)
  return {
    day: format(date, 'd'),
    month: format(date, 'MMM', { locale: getDateFnsLocale() }).replace('.', '')
  }
}

export function formatShortDate(isoDate: string, dateFormat: 'DMY' | 'MDY' = 'DMY'): string {
  return format(parseISO(isoDate), dateFormat === 'MDY' ? 'MM/dd/yy' : 'dd/MM/yy')
}

/** Fecha larga sin año ("3 de mayo" / "May 3") en el idioma activo. */
export function formatLongDayMonth(isoDate: string): string {
  return format(parseISO(isoDate), t('format.dayMonthLong'), { locale: getDateFnsLocale() })
}

export function formatDueLabel(isoDate: string, verb: DueLabelVerb = 'due'): string {
  const date = parseISO(isoDate)
  const verbLabel = t(`format.dueVerb.${verb}`)
  if (isToday(date)) {
    return t('format.dueToday', { verb: verbLabel })
  }
  if (isTomorrow(date)) {
    return t('format.dueTomorrow', { verb: verbLabel })
  }
  return t('format.dueOn', { verb: verbLabel, date: formatLongDayMonth(isoDate) })
}

export function formatRelativeDaysLabel(isoDate: string, referenceDate: Date = new Date()): string {
  const date = parseISO(isoDate)
  const daysDiff = differenceInCalendarDays(date, referenceDate)
  if (daysDiff === 0) {
    return t('format.today')
  }
  if (daysDiff > 0) {
    return t(daysDiff === 1 ? 'format.inOneDay' : 'format.inDays', { count: daysDiff })
  }
  const daysAgo = Math.abs(daysDiff)
  return t(daysAgo === 1 ? 'format.oneDayAgo' : 'format.daysAgo', { count: daysAgo })
}

export function formatDaysRemainingLabel(isoDate: string): string {
  const date = parseISO(isoDate)
  if (isToday(date)) {
    return t('format.dueToday', { verb: t('format.dueVerb.due') })
  }
  if (isTomorrow(date)) {
    return t('format.dueTomorrow', { verb: t('format.dueVerb.due') })
  }
  const daysRemaining = differenceInCalendarDays(date, new Date())
  if (daysRemaining < 0) {
    return t('format.overdue')
  }
  return t('format.daysLeft', { count: daysRemaining })
}

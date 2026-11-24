import { differenceInCalendarMonths, parseISO } from 'date-fns'
import { t } from '@/i18n'

export function resolveGoalRemainingLabel(
  targetDate: string | undefined,
  referenceDate: Date = new Date()
): string | null {
  if (!targetDate) {
    return null
  }
  const monthsRemaining = differenceInCalendarMonths(parseISO(targetDate), referenceDate)
  if (monthsRemaining <= 0) {
    return t('format.goal.dueThisMonth')
  }
  return monthsRemaining === 1
    ? t('format.goal.oneMonthLeft')
    : t('format.goal.monthsLeft', { count: monthsRemaining })
}

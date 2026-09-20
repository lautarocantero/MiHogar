import { differenceInCalendarMonths, parseISO } from 'date-fns'

export function resolveGoalRemainingLabel(
  targetDate: string | undefined,
  referenceDate: Date = new Date()
): string | null {
  if (!targetDate) {
    return null
  }
  const monthsRemaining = differenceInCalendarMonths(parseISO(targetDate), referenceDate)
  if (monthsRemaining <= 0) {
    return 'Vence este mes'
  }
  return `${monthsRemaining} ${monthsRemaining === 1 ? 'mes restante' : 'meses restantes'}`
}

import { addMonths, format, getDaysInMonth, isBefore, setDate } from 'date-fns'

export function computeNextClosingDate(closingDay: number, referenceDate: Date): string {
  const clampedDay = Math.min(closingDay, getDaysInMonth(referenceDate))
  const candidate = setDate(referenceDate, clampedDay)
  const next = isBefore(candidate, referenceDate) ? addMonths(candidate, 1) : candidate
  return format(next, 'yyyy-MM-dd')
}

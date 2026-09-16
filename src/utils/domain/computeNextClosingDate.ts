import { addMonths, format, isBefore, setDate } from 'date-fns'

export function computeNextClosingDate(closingDay: number, referenceDate: Date): string {
  const candidate = setDate(referenceDate, closingDay)
  const next = isBefore(candidate, referenceDate) ? addMonths(candidate, 1) : candidate
  return format(next, 'yyyy-MM-dd')
}

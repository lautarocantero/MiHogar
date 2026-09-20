import { addMonths, format, getDaysInMonth, isAfter, parseISO, setDate } from 'date-fns'

export function computeNextDueDate(closingIsoDate: string, dueDay: number): string {
  const closingDate = parseISO(closingIsoDate)
  const clampedDay = Math.min(dueDay, getDaysInMonth(closingDate))
  const candidate = setDate(closingDate, clampedDay)
  const due = isAfter(candidate, closingDate) ? candidate : addMonths(candidate, 1)
  return format(due, 'yyyy-MM-dd')
}

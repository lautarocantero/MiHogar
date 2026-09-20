import { addMonths, format, isAfter, parseISO, setDate } from 'date-fns'

export function computeNextDueDate(closingIsoDate: string, dueDay: number): string {
  const closingDate = parseISO(closingIsoDate)
  const candidate = setDate(closingDate, dueDay)
  const due = isAfter(candidate, closingDate) ? candidate : addMonths(candidate, 1)
  return format(due, 'yyyy-MM-dd')
}

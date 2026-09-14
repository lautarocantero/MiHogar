import { format, isTomorrow, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDayMonth(isoDate: string): { day: string; month: string } {
  const date = parseISO(isoDate)
  return {
    day: format(date, 'd'),
    month: format(date, 'MMM', { locale: es }).replace('.', '')
  }
}

export function formatDueLabel(isoDate: string): string {
  const date = parseISO(isoDate)
  if (isToday(date)) {
    return 'Vence hoy'
  }
  if (isTomorrow(date)) {
    return 'Vence mañana'
  }
  return `Vence el ${format(date, "d 'de' MMMM", { locale: es })}`
}

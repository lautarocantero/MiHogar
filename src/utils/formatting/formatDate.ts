import { differenceInCalendarDays, format, isTomorrow, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDayMonth(isoDate: string): { day: string; month: string } {
  const date = parseISO(isoDate)
  return {
    day: format(date, 'd'),
    month: format(date, 'MMM', { locale: es }).replace('.', '')
  }
}

export function formatShortDate(isoDate: string): string {
  return format(parseISO(isoDate), 'dd/MM/yy')
}

export function formatDueLabel(isoDate: string, verb: string = 'Vence'): string {
  const date = parseISO(isoDate)
  if (isToday(date)) {
    return `${verb} hoy`
  }
  if (isTomorrow(date)) {
    return `${verb} mañana`
  }
  return `${verb} el ${format(date, "d 'de' MMMM", { locale: es })}`
}

export function formatRelativeDaysLabel(isoDate: string, referenceDate: Date = new Date()): string {
  const date = parseISO(isoDate)
  const daysDiff = differenceInCalendarDays(date, referenceDate)
  if (daysDiff === 0) {
    return 'Hoy'
  }
  if (daysDiff > 0) {
    return `Faltan ${daysDiff} día${daysDiff === 1 ? '' : 's'}`
  }
  const daysAgo = Math.abs(daysDiff)
  return `Hace ${daysAgo} día${daysAgo === 1 ? '' : 's'}`
}

export function formatDaysRemainingLabel(isoDate: string): string {
  const date = parseISO(isoDate)
  if (isToday(date)) {
    return 'Vence hoy'
  }
  if (isTomorrow(date)) {
    return 'Vence mañana'
  }
  const daysRemaining = differenceInCalendarDays(date, new Date())
  if (daysRemaining < 0) {
    return 'Vencido'
  }
  return `Faltan ${daysRemaining} días`
}

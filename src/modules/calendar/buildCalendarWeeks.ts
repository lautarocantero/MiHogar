import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { CalendarDay, CalendarDayEvent } from './typings/types'

const DAYS_PER_WEEK = 7

export function buildCalendarWeeks(
  referenceDate: Date,
  today: Date,
  eventsByIsoDate: Map<string, CalendarDayEvent[]>
): CalendarDay[][] {
  const monthStart = startOfMonth(referenceDate)
  const monthEnd = endOfMonth(referenceDate)
  const gridStart = startOfWeek(monthStart, { locale: es })
  const gridEnd = endOfWeek(monthEnd, { locale: es })

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => {
    const isoDate = format(date, 'yyyy-MM-dd')
    const day: CalendarDay = {
      dayOfMonth: date.getDate(),
      isoDate,
      isToday: isSameDay(date, today),
      isCurrentMonth: isSameMonth(date, referenceDate),
      isPast: isBefore(date, today) && !isSameDay(date, today),
      events: eventsByIsoDate.get(isoDate) ?? []
    }
    return day
  })

  const weeks: CalendarDay[][] = []
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
    weeks.push(days.slice(i, i + DAYS_PER_WEEK))
  }
  return weeks
}

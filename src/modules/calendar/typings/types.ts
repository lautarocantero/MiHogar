import type { Payment } from '@/typings/domain/types'
import type { CalendarEventKind } from './enums'

export type CalendarDayEvent = {
  kind: CalendarEventKind
  amount: number
}

export type CalendarDay = {
  dayOfMonth: number
  isoDate: string
  isToday: boolean
  isCurrentMonth: boolean
  event: CalendarDayEvent | null
}

export type MonthlyProgress = {
  totalDue: number
  paidSoFar: number
  progressPercent: number
}

export type WeekAheadPayment = Payment & {
  accountName: string
}

export type CalendarData = {
  weeks: CalendarDay[][]
  monthLabel: string
  progress: MonthlyProgress
  weekAheadPayments: WeekAheadPayment[]
}

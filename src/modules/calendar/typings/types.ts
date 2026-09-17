import type { CalendarEventKind } from './enums'

export type CalendarDayEvent = {
  kind: CalendarEventKind
  amount: number
  label: string
  isFinalInstallment?: boolean
}

export type CalendarDay = {
  dayOfMonth: number
  isoDate: string
  isToday: boolean
  isCurrentMonth: boolean
  isPast: boolean
  events: CalendarDayEvent[]
}

export type MonthlyProgress = {
  totalDue: number
  paidSoFar: number
  progressPercent: number
}

export type FinalInstallmentSummary = {
  concept: string
  daysUntil: number
}

export type CalendarData = {
  weeks: CalendarDay[][]
  monthLabel: string
  progress: MonthlyProgress
  finalInstallmentPayments: FinalInstallmentSummary[]
}

import type { CalendarBadgeKind, CalendarEventKind } from './enums'

export type CalendarDayEvent = {
  kind: CalendarEventKind
  amount: number
  label: string
  isFinalInstallment?: boolean
}

export type CalendarDayBadge = {
  kind: CalendarBadgeKind
  label: string
  amount?: number
  accountId?: string
  accountName?: string
  dueDate?: string
}

export type CalendarDay = {
  dayOfMonth: number
  isoDate: string
  isToday: boolean
  isCurrentMonth: boolean
  isPast: boolean
  events: CalendarDayEvent[]
  badges: CalendarDayBadge[]
  isCardPaymentPeriod: boolean
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

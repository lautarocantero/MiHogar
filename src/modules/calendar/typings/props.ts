import type {
  CalendarDay,
  CalendarPayment,
  FinalInstallmentSummary,
  MonthlyProgress
} from './types'

export type MonthGridProps = {
  weeks: CalendarDay[][]
}

export type WeekdayHeaderProps = {
  days: CalendarDay[]
}

export type MonthGridCellProps = {
  day: CalendarDay
}

export type MonthlyProgressCardProps = {
  monthLabel: string
  progress: MonthlyProgress
  finalInstallmentPayments: FinalInstallmentSummary[]
}

export type MonthPaymentsListProps = {
  payments: CalendarPayment[]
}

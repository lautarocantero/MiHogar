import type { CalendarDay, MonthlyProgress, WeekAheadPayment } from './types'

export type MonthGridProps = {
  weeks: CalendarDay[][]
}

export type MonthGridCellProps = {
  day: CalendarDay
}

export type MonthlyProgressCardProps = {
  monthLabel: string
  progress: MonthlyProgress
}

export type WeekAheadListProps = {
  payments: WeekAheadPayment[]
}

import type { UnifiedEntry } from '@/modules/payments/typings/types'
import type { CalendarDay, FinalInstallmentSummary, MonthlyProgress } from './types'

export type MonthGridProps = {
  weeks: CalendarDay[][]
  selectedDate: string | null
  highlightedDate: string | null
  onSelectDate: (isoDate: string) => void
}

export type WeekdayHeaderProps = {
  days: CalendarDay[]
}

export type MonthGridCellProps = {
  day: CalendarDay
  isSelected: boolean
  isHighlighted: boolean
  onSelect: () => void
}

export type CalendarTimelineCardProps = {
  entry: UnifiedEntry
  isHighlighted: boolean
  onHover: (isoDate: string | null) => void
  onSelect: () => void
}

export type MonthlyProgressCardProps = {
  monthLabel: string
  progress: MonthlyProgress
  finalInstallmentPayments: FinalInstallmentSummary[]
}

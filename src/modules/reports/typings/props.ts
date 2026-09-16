import type {
  CategoryBreakdownEntry,
  ExpenseComparison,
  FlowSummary,
  MonthlyExpensePoint
} from '@/typings/domain/types'
import type { ReportChartType } from './enums'
import type { MonthComparisonEntry } from './types'

export type MonthlyBarsChartProps = {
  series: MonthlyExpensePoint[]
}

export type MonthComparisonPickerProps = {
  monthAKey: string
  monthBKey: string
  onChangeMonthA: (value: string) => void
  onChangeMonthB: (value: string) => void
}

export type ChartTypeToggleProps = {
  value: ReportChartType
  onChange: (value: ReportChartType) => void
}

export type MonthComparisonChartProps = {
  chartType: ReportChartType
  monthA: MonthComparisonEntry
  monthB: MonthComparisonEntry
}

export type ExpenseComparisonPhraseProps = {
  comparison: ExpenseComparison
}

export type CategoryBreakdownCardProps = {
  entries: CategoryBreakdownEntry[]
}

export type InflowOutflowChartProps = {
  flow: FlowSummary
  savingsRatePercent: number
}

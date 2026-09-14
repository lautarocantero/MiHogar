import type {
  CategoryBreakdownEntry,
  ExpenseComparison,
  FlowSummary,
  MonthlyExpensePoint
} from '@/typings/domain/types'

export type MonthlyBarsChartProps = {
  series: MonthlyExpensePoint[]
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

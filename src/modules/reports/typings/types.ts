import type {
  CategoryBreakdownEntry,
  ExpenseComparison,
  FlowSummary,
  MonthlyExpensePoint
} from '@/typings/domain/types'

export type ReportsData = {
  monthlySeries: MonthlyExpensePoint[]
  comparison: ExpenseComparison
  categoryBreakdown: CategoryBreakdownEntry[]
  currentMonthFlow: FlowSummary
  savingsRatePercent: number
}

export type MonthComparisonEntry = {
  monthKey: string
  monthLabel: string
  breakdown: CategoryBreakdownEntry[]
  flow: FlowSummary
  savingsRatePercent: number
}

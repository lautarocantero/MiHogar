import { useMemo } from 'react'
import { format } from 'date-fns'
import { useAppSelector } from '@/store/hooks'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { computeMonthlyExpenseSeries } from '@/utils/domain/computeMonthlyExpenseSeries'
import { computeCategoryBreakdown } from '@/utils/domain/computeCategoryBreakdown'
import { computeExpenseComparison } from '@/utils/domain/computeExpenseComparison'
import { computeFlowSummary } from '@/utils/domain/computeFlowSummary'
import { computeSavingsRate } from '@/utils/domain/computeSavingsRate'
import type { ReportsData } from './typings/types'

export function useReportsData(): ReportsData {
  const movements = useAppSelector(selectAllMovements)
  const categories = useAppSelector(selectAllCategories)

  return useMemo(() => {
    const today = new Date()
    const currentMonthKey = format(today, 'yyyy-MM')
    const currentMonthMovements = movements.filter((movement) =>
      movement.date.startsWith(currentMonthKey)
    )
    const currentMonthFlow = computeFlowSummary(currentMonthMovements)

    return {
      monthlySeries: computeMonthlyExpenseSeries(movements, today),
      comparison: computeExpenseComparison(movements, categories, today),
      categoryBreakdown: computeCategoryBreakdown(movements, categories, today),
      currentMonthFlow,
      savingsRatePercent: computeSavingsRate(currentMonthFlow.totalIn, currentMonthFlow.totalOut)
    }
  }, [movements, categories])
}

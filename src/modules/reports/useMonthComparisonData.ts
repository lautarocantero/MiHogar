import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { computeCategoryBreakdown } from '@/utils/domain/computeCategoryBreakdown'
import { computeFlowSummary } from '@/utils/domain/computeFlowSummary'
import { computeSavingsRate } from '@/utils/domain/computeSavingsRate'
import type { Category, Movement } from '@/typings/domain/types'
import type { MonthComparisonEntry } from './typings/types'

function buildMonthEntry(
  monthKey: string,
  movements: Movement[],
  categories: Category[]
): MonthComparisonEntry {
  const referenceDate = parseISO(`${monthKey}-01`)
  const monthMovements = movements.filter((movement) => movement.date.startsWith(monthKey))
  const flow = computeFlowSummary(monthMovements)

  return {
    monthKey,
    monthLabel: format(referenceDate, "MMMM 'de' yyyy", { locale: es }),
    breakdown: computeCategoryBreakdown(movements, categories, referenceDate),
    flow,
    savingsRatePercent: computeSavingsRate(flow.totalIn, flow.totalOut)
  }
}

export type MonthComparisonData = {
  monthA: MonthComparisonEntry
  monthB: MonthComparisonEntry
}

export function useMonthComparisonData(monthAKey: string, monthBKey: string): MonthComparisonData {
  const movements = useAppSelector(selectAllMovements)
  const categories = useAppSelector(selectAllCategories)

  return useMemo(
    () => ({
      monthA: buildMonthEntry(monthAKey, movements, categories),
      monthB: buildMonthEntry(monthBKey, movements, categories)
    }),
    [monthAKey, monthBKey, movements, categories]
  )
}

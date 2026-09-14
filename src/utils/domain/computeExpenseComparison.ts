import { format, subMonths } from 'date-fns'
import type { Category, ExpenseComparison, Movement } from '@/typings/domain/types'
import { MovementType } from '@/typings/domain/enums'

const TOP_CATEGORIES_LIMIT = 2

export function computeExpenseComparison(
  movements: Movement[],
  categories: Category[],
  referenceDate: Date
): ExpenseComparison {
  const currentMonthKey = format(referenceDate, 'yyyy-MM')
  const previousMonthKey = format(subMonths(referenceDate, 1), 'yyyy-MM')
  const categoriesById = new Map(categories.map((category) => [category.id, category]))

  const expenseMovements = movements.filter((movement) => movement.type === MovementType.EXPENSE)
  const currentMonthMovements = expenseMovements.filter((movement) =>
    movement.date.startsWith(currentMonthKey)
  )
  const previousMonthMovements = expenseMovements.filter((movement) =>
    movement.date.startsWith(previousMonthKey)
  )

  const currentTotal = currentMonthMovements.reduce((sum, movement) => sum + movement.amount, 0)
  const previousTotal = previousMonthMovements.reduce((sum, movement) => sum + movement.amount, 0)

  const sumByCategory = (movementsList: Movement[]): Map<string, number> => {
    const totals = new Map<string, number>()
    movementsList.forEach((movement) => {
      const key = movement.categoryId ?? 'sin-categoria'
      totals.set(key, (totals.get(key) ?? 0) + movement.amount)
    })
    return totals
  }

  const currentByCategory = sumByCategory(currentMonthMovements)
  const previousByCategory = sumByCategory(previousMonthMovements)

  const categoryDeltas = Array.from(currentByCategory.entries())
    .map(([categoryId, total]) => ({
      categoryId,
      delta: total - (previousByCategory.get(categoryId) ?? 0)
    }))
    .filter((entry) => entry.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, TOP_CATEGORIES_LIMIT)
    .map((entry) => categoriesById.get(entry.categoryId)?.name ?? 'Sin categoría')

  return {
    differenceAmount: Math.abs(currentTotal - previousTotal),
    isIncrease: currentTotal >= previousTotal,
    topChangedCategoryNames: categoryDeltas
  }
}

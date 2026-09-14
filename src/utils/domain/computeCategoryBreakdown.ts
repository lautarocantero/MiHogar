import { format } from 'date-fns'
import type { CategoryBreakdownEntry, Category, Movement } from '@/typings/domain/types'
import { MovementType } from '@/typings/domain/enums'

export function computeCategoryBreakdown(
  movements: Movement[],
  categories: Category[],
  referenceDate: Date
): CategoryBreakdownEntry[] {
  const monthKey = format(referenceDate, 'yyyy-MM')
  const expensesThisMonth = movements.filter(
    (movement) => movement.type === MovementType.EXPENSE && movement.date.startsWith(monthKey)
  )
  const totalExpense = expensesThisMonth.reduce((sum, movement) => sum + movement.amount, 0)

  const totalsByCategory = new Map<string, number>()
  expensesThisMonth.forEach((movement) => {
    const key = movement.categoryId ?? 'sin-categoria'
    totalsByCategory.set(key, (totalsByCategory.get(key) ?? 0) + movement.amount)
  })

  const categoriesById = new Map(categories.map((category) => [category.id, category]))

  return Array.from(totalsByCategory.entries())
    .map(([categoryId, total]) => ({
      categoryId,
      categoryName: categoriesById.get(categoryId)?.name ?? 'Sin categoría',
      total,
      percent: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0
    }))
    .sort((a, b) => b.total - a.total)
}

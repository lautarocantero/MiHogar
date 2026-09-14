import { format, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Movement, MonthlyExpensePoint } from '@/typings/domain/types'
import { MovementType } from '@/typings/domain/enums'

const MONTHS_TO_SHOW = 6

export function computeMonthlyExpenseSeries(
  movements: Movement[],
  referenceDate: Date
): MonthlyExpensePoint[] {
  const months = Array.from({ length: MONTHS_TO_SHOW }, (_, index) =>
    subMonths(referenceDate, MONTHS_TO_SHOW - 1 - index)
  )

  const expenseMovements = movements.filter((movement) => movement.type === MovementType.EXPENSE)

  return months.map((monthDate) => {
    const monthKey = format(monthDate, 'yyyy-MM')
    const total = expenseMovements
      .filter((movement) => movement.date.startsWith(monthKey))
      .reduce((sum, movement) => sum + movement.amount, 0)

    return {
      monthKey,
      monthLabel: format(monthDate, 'MMM', { locale: es }).replace('.', ''),
      total,
      isCurrentMonth: monthKey === format(referenceDate, 'yyyy-MM')
    }
  })
}

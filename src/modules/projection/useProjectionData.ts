import { useMemo } from 'react'
import { addDays, endOfMonth, format, isWithinInterval, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectTotalAvailableBalance } from '@/store/accounts/accountsSelectors'
import { selectPendingPayments } from '@/store/payments/paymentsSelectors'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { MovementType, PaymentKind } from '@/typings/domain/enums'
import { computeProjectionSeries } from '@/utils/domain/computeProjectionSeries'
import { computePendingTotal } from '@/utils/domain/computePendingTotal'
import type { ProjectionData } from './typings/types'

export function useProjectionData(): ProjectionData {
  const todayBalance = useAppSelector(selectTotalAvailableBalance)
  const pendingPayments = useAppSelector(selectPendingPayments)
  const movements = useAppSelector(selectAllMovements)

  return useMemo(() => {
    const today = new Date()
    const monthEnd = endOfMonth(today)
    const pendingRangeInterval = { start: today, end: monthEnd }
    const futureIncomeRangeInterval = { start: addDays(today, 1), end: monthEnd }

    const pendingThisRange = pendingPayments.filter((payment) =>
      isWithinInterval(parseISO(payment.dueDate), pendingRangeInterval)
    )
    const pendingExpensesThisRange = pendingThisRange.filter(
      (payment) => payment.kind !== PaymentKind.DEPOSIT
    )
    const pendingDepositsThisRange = pendingThisRange.filter(
      (payment) => payment.kind === PaymentKind.DEPOSIT
    )
    const incomeThisRange = movements.filter(
      (movement) =>
        movement.type === MovementType.INCOME &&
        isWithinInterval(parseISO(movement.date), futureIncomeRangeInterval)
    )

    const pendingTotal = computePendingTotal(pendingExpensesThisRange)
    const expectedIncome =
      incomeThisRange.reduce((total, movement) => total + movement.amount, 0) +
      pendingDepositsThisRange.reduce((total, payment) => total + payment.amount, 0)

    const series = computeProjectionSeries(
      todayBalance,
      today,
      monthEnd,
      pendingExpensesThisRange,
      incomeThisRange,
      pendingDepositsThisRange
    )

    const endOfMonthBalance = todayBalance - pendingTotal + expectedIncome

    return {
      series,
      todayBalance,
      pendingTotal,
      expectedIncome,
      endOfMonthBalance,
      endOfMonthLabel: format(monthEnd, "d 'de' MMM", { locale: es }),
      isPositive: endOfMonthBalance >= 0
    }
  }, [todayBalance, pendingPayments, movements])
}

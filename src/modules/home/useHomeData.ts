import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts, selectTotalAvailableBalance } from '@/store/accounts/accountsSelectors'
import { selectPendingPayments } from '@/store/payments/paymentsSelectors'
import { selectRecentMovements } from '@/store/movements/movementsSelectors'
import { computePendingTotal } from '@/utils/domain/computePendingTotal'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { PaymentKind } from '@/typings/domain/enums'
import type { HomeData } from './typings/types'

const UPCOMING_PAYMENTS_LIMIT = 3
const RECENT_MOVEMENTS_LIMIT = 3

export function useHomeData(): HomeData {
  const totalAvailable = useAppSelector(selectTotalAvailableBalance)
  const accounts = useAppSelector(selectAllAccounts)
  const pendingPayments = useAppSelector(selectPendingPayments)
  const recentMovements = useAppSelector((state) =>
    selectRecentMovements(state, RECENT_MOVEMENTS_LIMIT)
  )

  return useMemo(() => {
    const pendingExpensePayments = pendingPayments.filter(
      (payment) => payment.kind !== PaymentKind.DEPOSIT
    )
    const pendingTotal = computePendingTotal(pendingExpensePayments)
    const accountsById = new Map(accounts.map((account) => [account.id, account]))
    const sortedAccounts = [...accounts].sort((a, b) => b.balance - a.balance)

    const upcomingPayments = pendingPayments
      .map((payment) => ({
        payment,
        accountName: accountsById.get(payment.accountId)?.name ?? 'Cuenta sin definir',
        displayDate: resolvePaymentDisplayDate(payment, accountsById.get(payment.accountId))
      }))
      .sort((a, b) => a.displayDate.localeCompare(b.displayDate))
      .slice(0, UPCOMING_PAYMENTS_LIMIT)

    const recentMovementsView = recentMovements.map((movement) => ({
      movement,
      accountName: accountsById.get(movement.accountId)?.name ?? 'Cuenta sin definir'
    }))

    return {
      totalAvailable,
      accounts: sortedAccounts,
      pendingTotal,
      pendingCount: pendingExpensePayments.length,
      remainingAfterPayments: totalAvailable - pendingTotal,
      upcomingPayments,
      recentMovements: recentMovementsView
    }
  }, [totalAvailable, accounts, pendingPayments, recentMovements])
}

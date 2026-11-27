import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts, selectTotalAvailableBalance } from '@/store/accounts/accountsSelectors'
import { selectPendingPayments } from '@/store/payments/paymentsSelectors'
import { selectAllMovements, selectRecentMovements } from '@/store/movements/movementsSelectors'
import { selectActiveDebts } from '@/store/debts/debtsSelectors'
import { allocateCardPayments, computeCardDebts } from '@/utils/domain/computeCardDebts'
import { resolveCardMovementCycle } from '@/utils/domain/resolveCardMovementCycle'
import { computePendingTotal } from '@/utils/domain/computePendingTotal'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { AccountType, DebtDirection, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import type { HomeData, HomeDebtItem, UpcomingPaymentView } from './typings/types'

const UPCOMING_PAYMENTS_LIMIT = 3
const RECENT_MOVEMENTS_LIMIT = 3

export function useHomeData(): HomeData {
  const totalAvailable = useAppSelector(selectTotalAvailableBalance)
  const accounts = useAppSelector(selectAllAccounts)
  const pendingPayments = useAppSelector(selectPendingPayments)
  const allMovements = useAppSelector(selectAllMovements)
  const activeDebts = useAppSelector(selectActiveDebts)
  const recentMovements = useAppSelector((state) =>
    selectRecentMovements(state, RECENT_MOVEMENTS_LIMIT)
  )

  return useMemo(() => {
    const pendingExpensePayments = pendingPayments.filter(
      (payment) => payment.kind !== PaymentKind.DEPOSIT
    )
    const accountsById = new Map(accounts.map((account) => [account.id, account]))
    const remainingById = allocateCardPayments(accounts, allMovements)
    const pendingCardMovements = allMovements.flatMap((movement) => {
      if (movement.paymentId != null) return []
      const account = accountsById.get(movement.accountId)
      const cycle = resolveCardMovementCycle(movement, account, remainingById)
      return cycle && cycle.status === PaymentStatus.PENDING && account ? [{ account, cycle }] : []
    })
    const pendingTotal =
      computePendingTotal(pendingExpensePayments) +
      pendingCardMovements.reduce((sum, { cycle }) => sum + cycle.remaining, 0)
    const sortedAccounts = [...accounts].sort((a, b) => b.balance - a.balance)

    const nonCardPayments: UpcomingPaymentView[] = []
    const cardGroups = new Map<
      string,
      {
        accountId: string
        accountName: string
        amount: number
        displayDate: string
        paymentCount: number
      }
    >()
    const addToCardGroup = (
      accountId: string,
      accountName: string,
      displayDate: string,
      amount: number
    ): void => {
      const key = `${accountId}|${displayDate}`
      const existing = cardGroups.get(key)
      if (existing) {
        existing.amount += amount
        existing.paymentCount += 1
      } else {
        cardGroups.set(key, { accountId, accountName, amount, displayDate, paymentCount: 1 })
      }
    }

    for (const payment of pendingPayments) {
      const account = accountsById.get(payment.accountId)
      const displayDate = resolvePaymentDisplayDate(payment, account)

      if (account?.type === AccountType.CREDIT_CARD) {
        addToCardGroup(account.id, account.name, displayDate, payment.amount)
        continue
      }

      nonCardPayments.push({
        kind: 'payment',
        payment,
        accountName: account?.name ?? 'Cuenta sin definir',
        displayDate
      })
    }

    pendingCardMovements.forEach(({ account, cycle }) =>
      addToCardGroup(account.id, account.name, cycle.displayDate, cycle.remaining)
    )

    const cardClosings: UpcomingPaymentView[] = Array.from(cardGroups.values()).map((group) => ({
      kind: 'cardClosing',
      accountId: group.accountId,
      accountName: group.accountName,
      amount: group.amount,
      displayDate: group.displayDate,
      paymentCount: group.paymentCount
    }))

    const upcomingPayments = [...nonCardPayments, ...cardClosings]
      .sort((a, b) => a.displayDate.localeCompare(b.displayDate))
      .slice(0, UPCOMING_PAYMENTS_LIMIT)

    const recentMovementsView = recentMovements.map((movement) => ({
      movement,
      accountName: accountsById.get(movement.accountId)?.name ?? 'Cuenta sin definir'
    }))

    const storedDebtItems: HomeDebtItem[] = activeDebts
      .filter(
        (debt) => debt.direction === DebtDirection.OWED_BY_HOUSEHOLD && debt.outstandingBalance > 0
      )
      .map((debt) => ({
        id: debt.id,
        name: debt.name,
        counterparty: debt.counterparty,
        amount: debt.outstandingBalance
      }))
    const cardDebtItems: HomeDebtItem[] = computeCardDebts(accounts, allMovements).map((debt) => ({
      id: `card-${debt.account.id}`,
      name: debt.account.name,
      counterparty: debt.bankName,
      amount: debt.totalRemaining
    }))
    const debts = [...cardDebtItems, ...storedDebtItems]

    return {
      debts,
      totalDebt: debts.reduce((sum, debt) => sum + debt.amount, 0),
      pendingCount: pendingExpensePayments.length + pendingCardMovements.length,
      totalAvailable,
      accounts: sortedAccounts,
      pendingTotal,
      remainingAfterPayments: totalAvailable - pendingTotal,
      upcomingPayments,
      recentMovements: recentMovementsView
    }
  }, [totalAvailable, accounts, pendingPayments, allMovements, activeDebts, recentMovements])
}

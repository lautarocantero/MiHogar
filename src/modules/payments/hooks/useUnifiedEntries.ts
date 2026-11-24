import { useMemo } from 'react'
import { format, startOfDay } from 'date-fns'
import { useAppSelector } from '@/store/hooks'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { resolveMovementConcept } from '@/utils/domain/resolveMovementConcept'
import { resolveMovementDetail } from '@/utils/domain/resolveMovementDetail'
import { PaymentStatus } from '@/typings/domain/enums'
import type { PaymentView, UnifiedEntry } from '../typings/types'
import { t, useI18n } from '@/i18n'

export function useUnifiedEntries(): UnifiedEntry[] {
  const payments = useAppSelector(selectAllPayments)
  const movements = useAppSelector(selectAllMovements)
  const accounts = useAppSelector(selectAllAccounts)
  const members = useAppSelector(selectAllMembers)
  const categories = useAppSelector(selectAllCategories)

  const { locale } = useI18n()

  return useMemo<UnifiedEntry[]>(() => {
    const accountsById = new Map(accounts.map((account) => [account.id, account]))
    const categoriesById = new Map(categories.map((category) => [category.id, category]))
    const todayIso = format(startOfDay(new Date()), 'yyyy-MM-dd')

    const paymentEntries: UnifiedEntry[] = payments.map((payment) => {
      const account = accountsById.get(payment.accountId)
      const displayDate = resolvePaymentDisplayDate(payment, account)
      const view: PaymentView = {
        ...payment,
        accountName: account?.name ?? t('payments.accountUndefined'),
        accountType: account?.type,
        ownerLabel: resolveOwnerLabel(payment.ownerType, payment.ownerId, members),
        categoryName: categoriesById.get(payment.categoryId)?.name ?? t('common.uncategorized'),
        displayDate
      }
      return { ...view, origin: 'payment', isPast: displayDate < todayIso }
    })

    const movementEntries: UnifiedEntry[] = movements
      .filter((movement) => movement.paymentId == null)
      .map((movement) => ({
        origin: 'movement',
        id: movement.id,
        amount: movement.amount,
        displayDate: movement.date,
        status: movement.date <= todayIso ? PaymentStatus.PAID : PaymentStatus.PENDING,
        accountType: accountsById.get(movement.accountId)?.type,
        accountName: accountsById.get(movement.accountId)?.name ?? t('payments.accountUndefined'),
        ownerLabel: resolveOwnerLabel(movement.ownerType, movement.ownerId, members),
        categoryName: movement.categoryId
          ? (categoriesById.get(movement.categoryId)?.name ?? t('common.uncategorized'))
          : t('common.uncategorized'),
        recurring: false,
        amountMode: undefined,
        movement,
        concept: resolveMovementConcept(movement, payments, categories),
        detail: resolveMovementDetail(movement, accounts),
        isEstimated: movement.date > todayIso,
        isPast: movement.date < todayIso
      }))

    return [...paymentEntries, ...movementEntries].sort((a, b) =>
      a.displayDate.localeCompare(b.displayDate)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps -- textos traducidos con el idioma activo
  }, [payments, movements, accounts, members, categories, locale])
}

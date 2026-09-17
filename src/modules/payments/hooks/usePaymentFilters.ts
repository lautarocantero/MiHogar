import { useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { AccountType, PaymentStatus } from '@/typings/domain/enums'
import { PaymentFilter, PaymentMethodFilter, PaymentSortBy } from '../typings/enums'
import type { PaymentView, UsePaymentFiltersResult } from '../typings/types'

export function usePaymentFilters(): UsePaymentFiltersResult {
  const payments = useAppSelector(selectAllPayments)
  const accounts = useAppSelector(selectAllAccounts)
  const members = useAppSelector(selectAllMembers)
  const categories = useAppSelector(selectAllCategories)
  const [activeFilter, setActiveFilter] = useState(PaymentFilter.PENDING)
  const [sortBy, setSortBy] = useState(PaymentSortBy.DATE)
  const [methodFilter, setMethodFilter] = useState(PaymentMethodFilter.ALL)

  const paymentViews = useMemo<PaymentView[]>(() => {
    const accountsById = new Map(accounts.map((account) => [account.id, account]))
    const categoriesById = new Map(categories.map((category) => [category.id, category]))

    return payments
      .map((payment) => {
        const account = accountsById.get(payment.accountId)
        return {
          ...payment,
          accountName: account?.name ?? 'Cuenta sin definir',
          accountType: account?.type,
          ownerLabel: resolveOwnerLabel(payment.ownerType, payment.ownerId, members),
          categoryName: categoriesById.get(payment.categoryId)?.name ?? 'Sin categoría',
          displayDate: resolvePaymentDisplayDate(payment, account)
        }
      })
      .sort((a, b) => a.displayDate.localeCompare(b.displayDate))
  }, [payments, accounts, members, categories])

  const pendingCount = paymentViews.filter((p) => p.status === PaymentStatus.PENDING).length
  const paidCount = paymentViews.filter((p) => p.status === PaymentStatus.PAID).length

  const filteredPayments = useMemo(() => {
    const byStatus =
      activeFilter === PaymentFilter.PENDING
        ? paymentViews.filter((p) => p.status === PaymentStatus.PENDING)
        : activeFilter === PaymentFilter.PAID
          ? paymentViews.filter((p) => p.status === PaymentStatus.PAID)
          : paymentViews

    const byMethod =
      methodFilter === PaymentMethodFilter.ALL
        ? byStatus
        : byStatus.filter((p) => {
            const isCard = p.accountType === AccountType.CREDIT_CARD
            return methodFilter === PaymentMethodFilter.CREDIT_CARD ? isCard : !isCard
          })

    if (sortBy === PaymentSortBy.AMOUNT) {
      return [...byMethod].sort((a, b) => b.amount - a.amount)
    }
    return byMethod
  }, [paymentViews, activeFilter, methodFilter, sortBy])

  const totalAmount = useMemo(
    () => filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
    [filteredPayments]
  )

  return {
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    methodFilter,
    setMethodFilter,
    filteredPayments,
    pendingCount,
    paidCount,
    totalCount: paymentViews.length,
    totalAmount
  }
}

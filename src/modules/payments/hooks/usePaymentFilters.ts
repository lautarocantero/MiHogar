import { useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { PaymentStatus } from '@/typings/domain/enums'
import { PaymentFilter } from '../typings/enums'
import type { PaymentView, UsePaymentFiltersResult } from '../typings/types'

export function usePaymentFilters(): UsePaymentFiltersResult {
  const payments = useAppSelector(selectAllPayments)
  const accounts = useAppSelector(selectAllAccounts)
  const members = useAppSelector(selectAllMembers)
  const categories = useAppSelector(selectAllCategories)
  const [activeFilter, setActiveFilter] = useState(PaymentFilter.PENDING)

  const paymentViews = useMemo<PaymentView[]>(() => {
    const accountsById = new Map(accounts.map((account) => [account.id, account]))
    const categoriesById = new Map(categories.map((category) => [category.id, category]))

    return payments
      .map((payment) => {
        const account = accountsById.get(payment.accountId)
        return {
          ...payment,
          accountName: account?.name ?? 'Cuenta sin definir',
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
    if (activeFilter === PaymentFilter.PENDING) {
      return paymentViews.filter((p) => p.status === PaymentStatus.PENDING)
    }
    if (activeFilter === PaymentFilter.PAID) {
      return paymentViews.filter((p) => p.status === PaymentStatus.PAID)
    }
    return paymentViews
  }, [paymentViews, activeFilter])

  return {
    activeFilter,
    setActiveFilter,
    filteredPayments,
    pendingCount,
    paidCount,
    totalCount: paymentViews.length
  }
}

import { useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { AccountType, PaymentStatus } from '@/typings/domain/enums'
import {
  PaymentFilter,
  PaymentMethodFilter,
  PaymentSortBy,
  PaymentTypeFilter
} from '../typings/enums'
import type { FilterOption, UsePaymentFiltersResult } from '../typings/types'
import { useUnifiedEntries } from './useUnifiedEntries'

const ALL = 'ALL'

export function usePaymentFilters(
  initialFilter: PaymentFilter = PaymentFilter.PENDING
): UsePaymentFiltersResult {
  const entries = useUnifiedEntries()
  const accounts = useAppSelector(selectAllAccounts)
  const categories = useAppSelector(selectAllCategories)
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [sortBy, setSortBy] = useState(PaymentSortBy.DATE)
  const [methodFilter, setMethodFilter] = useState(PaymentMethodFilter.ALL)
  const [typeFilter, setTypeFilter] = useState(PaymentTypeFilter.ALL)
  const [accountFilter, setAccountFilter] = useState(ALL)
  const [categoryFilter, setCategoryFilter] = useState(ALL)
  const [ownerFilter, setOwnerFilter] = useState(ALL)

  const accountOptions = useMemo<FilterOption[]>(
    () => accounts.map((account) => ({ value: account.id, label: account.name })),
    [accounts]
  )
  const categoryOptions = useMemo<FilterOption[]>(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories]
  )
  const ownerOptions = useMemo<FilterOption[]>(() => {
    const labels = new Set(entries.map((entry) => entry.ownerLabel))
    return Array.from(labels)
      .sort()
      .map((label) => ({ value: label, label }))
  }, [entries])

  const pendingCount = entries.filter((entry) => entry.status === PaymentStatus.PENDING).length
  const paidCount = entries.filter((entry) => entry.status === PaymentStatus.PAID).length

  const filteredEntries = useMemo(() => {
    const byStatus =
      activeFilter === PaymentFilter.PENDING
        ? entries.filter((entry) => entry.status === PaymentStatus.PENDING)
        : activeFilter === PaymentFilter.PAID
          ? entries.filter((entry) => entry.status === PaymentStatus.PAID)
          : entries

    const byMethod =
      methodFilter === PaymentMethodFilter.ALL
        ? byStatus
        : byStatus.filter((entry) => {
            const isCard = entry.accountType === AccountType.CREDIT_CARD
            return methodFilter === PaymentMethodFilter.CREDIT_CARD ? isCard : !isCard
          })

    const byAccount =
      accountFilter === ALL
        ? byMethod
        : byMethod.filter((entry) => {
            const accountId =
              entry.origin === 'payment' ? entry.accountId : entry.movement.accountId
            return accountId === accountFilter
          })

    const byCategory =
      categoryFilter === ALL
        ? byAccount
        : byAccount.filter((entry) => {
            const categoryId =
              entry.origin === 'payment' ? entry.categoryId : entry.movement.categoryId
            return categoryId === categoryFilter
          })

    const byOwner =
      ownerFilter === ALL
        ? byCategory
        : byCategory.filter((entry) => entry.ownerLabel === ownerFilter)

    const byType =
      typeFilter === PaymentTypeFilter.ALL
        ? byOwner
        : byOwner.filter((entry) =>
            typeFilter === PaymentTypeFilter.RECURRING ? entry.recurring : !entry.recurring
          )

    if (sortBy === PaymentSortBy.AMOUNT) {
      return [...byType].sort((a, b) => b.amount - a.amount)
    }
    return byType
  }, [
    entries,
    activeFilter,
    methodFilter,
    accountFilter,
    categoryFilter,
    ownerFilter,
    typeFilter,
    sortBy
  ])

  const totalAmount = useMemo(
    () => filteredEntries.reduce((sum, entry) => sum + entry.amount, 0),
    [filteredEntries]
  )

  return {
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    methodFilter,
    setMethodFilter,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    categoryFilter,
    setCategoryFilter,
    ownerFilter,
    setOwnerFilter,
    accountOptions,
    categoryOptions,
    ownerOptions,
    filteredEntries,
    pendingCount,
    paidCount,
    totalCount: entries.length,
    totalAmount
  }
}

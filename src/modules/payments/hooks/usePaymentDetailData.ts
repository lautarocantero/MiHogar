import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectPaymentById } from '@/store/payments/paymentsSelectors'
import { selectAccountById } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import type { PaymentView } from '../typings/types'

export function usePaymentDetailData(paymentId: string): PaymentView | null {
  const payment = useAppSelector((state) => selectPaymentById(state, paymentId))
  const account = useAppSelector((state) =>
    payment ? selectAccountById(state, payment.accountId) : undefined
  )
  const members = useAppSelector(selectAllMembers)
  const categories = useAppSelector(selectAllCategories)

  return useMemo(() => {
    if (!payment) {
      return null
    }
    return {
      ...payment,
      accountName: account?.name ?? 'Cuenta sin definir',
      ownerLabel: resolveOwnerLabel(payment.ownerType, payment.ownerId, members),
      categoryName: categories.find((c) => c.id === payment.categoryId)?.name ?? 'Sin categoría'
    }
  }, [payment, account, members, categories])
}

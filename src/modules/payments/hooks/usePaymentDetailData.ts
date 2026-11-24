import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectPaymentById } from '@/store/payments/paymentsSelectors'
import { selectAccountById } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import type { PaymentView } from '../typings/types'
import { t, useI18n } from '@/i18n'

export function usePaymentDetailData(paymentId: string): PaymentView | null {
  const payment = useAppSelector((state) => selectPaymentById(state, paymentId))
  const account = useAppSelector((state) =>
    payment ? selectAccountById(state, payment.accountId) : undefined
  )
  const members = useAppSelector(selectAllMembers)
  const categories = useAppSelector(selectAllCategories)

  const { locale } = useI18n()

  return useMemo(() => {
    if (!payment) {
      return null
    }
    return {
      ...payment,
      accountName: account?.name ?? t('payments.accountUndefined'),
      ownerLabel: resolveOwnerLabel(payment.ownerType, payment.ownerId, members),
      categoryName: categories.find((c) => c.id === payment.categoryId)?.name ?? t('common.uncategorized'),
      displayDate: resolvePaymentDisplayDate(payment, account)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- textos traducidos con el idioma activo
  }, [payment, account, members, categories, locale])
}

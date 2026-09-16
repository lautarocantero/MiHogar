import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updatePayment } from '@/store/payments/paymentsSlice'
import { recordMovementThunk } from '@/store/movements/movementThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { MovementType, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import type { PaymentView, UseMarkPaymentAsPaidResult } from '../typings/types'

export function useMarkPaymentAsPaid(payment: PaymentView | null): UseMarkPaymentAsPaidResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const markAsPaid = useCallback(() => {
    if (!payment) {
      return
    }
    run(async () => {
      const today = new Date().toISOString().slice(0, 10)
      dispatch(updatePayment({ ...payment, status: PaymentStatus.PAID }))
      await dispatch(
        recordMovementThunk({
          type: payment.kind === PaymentKind.DEPOSIT ? MovementType.INCOME : MovementType.EXPENSE,
          amount: payment.amount,
          date: today,
          accountId: payment.accountId,
          categoryId: payment.categoryId,
          ownerType: payment.ownerType,
          ownerId: payment.ownerId,
          paymentId: payment.id,
          note: payment.concept
        })
      ).unwrap()
    }, 'No se pudo marcar el pago como pagado')
  }, [dispatch, run, payment])

  return { markAsPaid, isSubmitting: isLoading, errorMessage: error }
}

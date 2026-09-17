import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updatePayment } from '@/store/payments/paymentsSlice'
import { selectMovementsByPaymentId } from '@/store/movements/movementsSelectors'
import { removeMovementThunk } from '@/store/movements/movementThunks'
import { useLoader } from '@/hooks/shared/useLoader'
import { PaymentStatus } from '@/typings/domain/enums'
import type { PaymentView, UseCancelPaymentResult } from '../typings/types'

export function useCancelPayment(payment: PaymentView | null): UseCancelPaymentResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()
  const relatedMovements = useAppSelector((state) =>
    payment ? selectMovementsByPaymentId(state, payment.id) : []
  )

  const cancel = useCallback(() => {
    if (!payment) {
      return
    }
    run(async () => {
      for (const movement of relatedMovements) {
        await dispatch(removeMovementThunk(movement.id)).unwrap()
      }
      dispatch(updatePayment({ ...payment, status: PaymentStatus.PENDING }))
    }, 'No se pudo cancelar el pago')
  }, [dispatch, run, payment, relatedMovements])

  return { cancel, isSubmitting: isLoading, errorMessage: error }
}

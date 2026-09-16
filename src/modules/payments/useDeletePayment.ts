import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { removePayment } from '@/store/payments/paymentsSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { Payment } from '@/typings/domain/types'
import type { UseDeletePaymentResult } from './typings/types'

export function useDeletePayment(payment: Payment, onDeleted: () => void): UseDeletePaymentResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(() => {
    run(async () => {
      dispatch(removePayment(payment.id))
      onDeleted()
    }, 'No se pudo eliminar el pago')
  }, [dispatch, run, payment, onDeleted])

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

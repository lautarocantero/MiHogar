import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updatePayment } from '@/store/payments/paymentsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType } from '@/typings/domain/enums'
import type { Payment } from '@/typings/domain/types'
import type { AddPaymentFormValues, UseUpdatePaymentResult } from './typings/types'

export function useUpdatePayment(payment: Payment, onUpdated: () => void): UseUpdatePaymentResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddPaymentFormValues) => {
      run(async () => {
        dispatch(
          updatePayment({
            ...payment,
            concept: values.concept,
            entity: values.entity,
            accountId: values.accountId,
            categoryId: values.categoryId,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined,
            recurring: values.recurring,
            frequency: values.recurring ? values.frequency : undefined,
            dueDate: values.dueDate,
            amount: values.amount,
            amountMode: values.amountMode
          })
        )
        dispatch(showToast('Pago actualizado'))
        onUpdated()
      }, 'No se pudo guardar el pago')
    },
    [dispatch, run, payment, onUpdated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

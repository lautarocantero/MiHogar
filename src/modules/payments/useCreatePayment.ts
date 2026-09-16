import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addPayment } from '@/store/payments/paymentsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import type { AddPaymentFormValues, UseCreatePaymentResult } from './typings/types'

export function useCreatePayment(kind: PaymentKind, onCreated: () => void): UseCreatePaymentResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddPaymentFormValues) => {
      run(
        async () => {
          dispatch(
            addPayment({
              id: uuidv4(),
              concept: values.concept,
              entity: values.entity,
              accountId: values.accountId,
              ownerType: values.ownerType,
              ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined,
              recurring: values.recurring,
              frequency: values.recurring ? values.frequency : undefined,
              dueDate: values.dueDate,
              amount: values.amount,
              status: PaymentStatus.PENDING,
              categoryId: values.categoryId,
              attachments: [],
              kind,
              amountMode: values.amountMode
            })
          )
          dispatch(showToast(kind === PaymentKind.DEPOSIT ? 'Depósito agregado' : 'Pago agregado'))
          onCreated()
        },
        kind === PaymentKind.DEPOSIT
          ? 'No se pudo agregar el depósito'
          : 'No se pudo agregar el pago'
      )
    },
    [dispatch, run, onCreated, kind]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

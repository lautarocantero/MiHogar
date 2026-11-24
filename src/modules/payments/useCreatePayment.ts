import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addPayment } from '@/store/payments/paymentsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import type { AddPaymentFormValues, UseCreatePaymentResult } from './typings/types'
import { t } from '@/i18n'

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
              installmentsTotal: values.installmentsTotal,
              installmentsPaid: values.installmentsPaid,
              attachments: [],
              kind,
              amountMode: values.amountMode
            })
          )
          dispatch(showToast(
              kind === PaymentKind.DEPOSIT
                ? t('payments.toast.depositAdded')
                : t('payments.toast.paymentAdded')
            ))
          onCreated()
        },
        kind === PaymentKind.DEPOSIT
          ? t('payments.error.createDeposit')
          : t('payments.error.createPayment')
      )
    },
    [dispatch, run, onCreated, kind]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

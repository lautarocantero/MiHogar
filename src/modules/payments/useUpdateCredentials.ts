import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updatePayment } from '@/store/payments/paymentsSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { EditCredentialsFormValues, UseUpdateCredentialsResult } from './typings/types'
import type { PaymentView } from './typings/types'

export function useUpdateCredentials(
  payment: PaymentView,
  onUpdated: () => void
): UseUpdateCredentialsResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: EditCredentialsFormValues) => {
      run(async () => {
        dispatch(
          updatePayment({
            ...payment,
            providerUrl: values.providerUrl || undefined,
            credentials: {
              username: values.username || undefined,
              password: values.password || undefined,
              clientNumber: values.clientNumber || undefined
            }
          })
        )
        onUpdated()
      }, 'No se pudieron guardar los datos de acceso')
    },
    [dispatch, run, payment, onUpdated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

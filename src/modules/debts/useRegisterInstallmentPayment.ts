import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateDebt } from '@/store/debts/debtsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { computeNextInstallmentDate } from '@/utils/domain/computeNextInstallmentDate'
import { DebtStatus } from '@/typings/domain/enums'
import type { Debt } from '@/typings/domain/types'
import type { UseRegisterInstallmentPaymentResult } from './typings/types'

export function useRegisterInstallmentPayment(debt: Debt): UseRegisterInstallmentPaymentResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(() => {
    run(async () => {
      const installmentsPaid = (debt.installmentsPaid ?? 0) + 1
      const outstandingBalance = Math.max(
        debt.outstandingBalance - (debt.installmentAmount ?? 0),
        0
      )
      const isPaidOff =
        outstandingBalance === 0 ||
        (debt.installmentsTotal != null && installmentsPaid >= debt.installmentsTotal)

      dispatch(
        updateDebt({
          ...debt,
          installmentsPaid,
          outstandingBalance,
          nextInstallmentDate: isPaidOff
            ? undefined
            : debt.nextInstallmentDate
              ? computeNextInstallmentDate(debt.nextInstallmentDate, debt.frequency)
              : undefined,
          status: isPaidOff ? DebtStatus.PAID_OFF : DebtStatus.ACTIVE
        })
      )
      dispatch(showToast(isPaidOff ? '¡Deuda saldada!' : 'Cuota registrada'))
    }, 'No se pudo registrar el pago de la cuota')
  }, [dispatch, run, debt])

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

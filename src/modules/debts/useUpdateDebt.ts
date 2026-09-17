import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateDebt } from '@/store/debts/debtsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType } from '@/typings/domain/enums'
import type { Debt } from '@/typings/domain/types'
import type { AddDebtFormValues, UseUpdateDebtResult } from './typings/types'

export function useUpdateDebt(debt: Debt, onUpdated: () => void): UseUpdateDebtResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddDebtFormValues) => {
      run(async () => {
        dispatch(
          updateDebt({
            ...debt,
            direction: values.direction,
            name: values.name,
            counterparty: values.counterparty,
            principal: values.principal,
            outstandingBalance: values.outstandingBalance,
            rateAnnual: values.rateAnnual || undefined,
            installmentAmount: values.installmentAmount || undefined,
            installmentsTotal: values.installmentsTotal || undefined,
            installmentsPaid: values.installmentsPaid || undefined,
            frequency: values.frequency,
            nextInstallmentDate: values.nextInstallmentDate || undefined,
            startDate: values.startDate || undefined,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined,
            reminderEnabled: values.reminderEnabled,
            notes: values.notes || undefined
          })
        )
        dispatch(showToast('Deuda actualizada'))
        onUpdated()
      }, 'No se pudo guardar la deuda')
    },
    [dispatch, run, debt, onUpdated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

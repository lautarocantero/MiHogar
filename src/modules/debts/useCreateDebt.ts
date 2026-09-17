import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addDebt } from '@/store/debts/debtsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { DebtStatus, OwnerType } from '@/typings/domain/enums'
import type { AddDebtFormValues, UseCreateDebtResult } from './typings/types'

export function useCreateDebt(onCreated: () => void): UseCreateDebtResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddDebtFormValues) => {
      run(async () => {
        dispatch(
          addDebt({
            id: uuidv4(),
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
            status: DebtStatus.ACTIVE,
            notes: values.notes || undefined
          })
        )
        dispatch(showToast('Deuda agregada'))
        onCreated()
      }, 'No se pudo agregar la deuda')
    },
    [dispatch, run, onCreated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

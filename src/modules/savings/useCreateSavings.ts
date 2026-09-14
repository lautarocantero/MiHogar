import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addSavingsInstrument } from '@/store/savings/savingsSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType } from '@/typings/domain/enums'
import type { AddSavingsFormValues, UseCreateSavingsResult } from './typings/types'

export function useCreateSavings(onCreated: () => void): UseCreateSavingsResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddSavingsFormValues) => {
      run(async () => {
        dispatch(
          addSavingsInstrument({
            id: uuidv4(),
            name: values.name,
            principal: values.principal,
            monthlyInterestEstimate: values.monthlyInterestEstimate || undefined,
            rateAnnual: values.liquidAnytime ? undefined : values.rateAnnual || undefined,
            maturityDate: values.liquidAnytime ? undefined : values.maturityDate || undefined,
            liquidAnytime: values.liquidAnytime,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined
          })
        )
        onCreated()
      }, 'No se pudo agregar el ahorro')
    },
    [dispatch, run, onCreated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

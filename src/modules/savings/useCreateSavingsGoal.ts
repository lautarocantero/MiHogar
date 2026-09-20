import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addSavingsGoal } from '@/store/savingsGoals/savingsGoalsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType } from '@/typings/domain/enums'
import type { AddSavingsGoalFormValues, UseCreateSavingsGoalResult } from './typings/types'

export function useCreateSavingsGoal(onCreated: () => void): UseCreateSavingsGoalResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddSavingsGoalFormValues) => {
      run(async () => {
        dispatch(
          addSavingsGoal({
            id: uuidv4(),
            name: values.name,
            icon: values.icon,
            targetAmount: values.targetAmount,
            currentAmount: values.currentAmount,
            targetDate: values.targetDate || undefined,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined
          })
        )
        dispatch(showToast('Meta agregada'))
        onCreated()
      }, 'No se pudo agregar la meta')
    },
    [dispatch, run, onCreated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

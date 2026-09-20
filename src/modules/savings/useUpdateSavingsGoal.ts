import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateSavingsGoal } from '@/store/savingsGoals/savingsGoalsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType } from '@/typings/domain/enums'
import type { SavingsGoal } from '@/typings/domain/types'
import type { AddSavingsGoalFormValues, UseUpdateSavingsGoalResult } from './typings/types'

export function useUpdateSavingsGoal(
  goal: SavingsGoal,
  onUpdated: () => void
): UseUpdateSavingsGoalResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddSavingsGoalFormValues) => {
      run(async () => {
        dispatch(
          updateSavingsGoal({
            ...goal,
            name: values.name,
            icon: values.icon,
            targetAmount: values.targetAmount,
            currentAmount: values.currentAmount,
            targetDate: values.targetDate || undefined,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined
          })
        )
        dispatch(showToast('Meta actualizada'))
        onUpdated()
      }, 'No se pudo guardar la meta')
    },
    [dispatch, run, goal, onUpdated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

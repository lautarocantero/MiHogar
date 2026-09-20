import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { removeSavingsGoal } from '@/store/savingsGoals/savingsGoalsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { SavingsGoal } from '@/typings/domain/types'
import type { UseDeleteSavingsGoalResult } from './typings/types'

export function useDeleteSavingsGoal(
  goal: SavingsGoal,
  onDeleted: () => void
): UseDeleteSavingsGoalResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(() => {
    run(async () => {
      dispatch(removeSavingsGoal(goal.id))
      dispatch(showToast('Meta eliminada'))
      onDeleted()
    }, 'No se pudo eliminar la meta')
  }, [dispatch, run, goal, onDeleted])

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

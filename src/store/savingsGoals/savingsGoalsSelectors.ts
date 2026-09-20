import type { RootState } from '@/store'
import type { SavingsGoal } from '@/typings/domain/types'
import { savingsGoalsSelectors } from './savingsGoalsSlice'

export const selectAllSavingsGoals = (state: RootState): SavingsGoal[] =>
  savingsGoalsSelectors.selectAll(state.savingsGoals)

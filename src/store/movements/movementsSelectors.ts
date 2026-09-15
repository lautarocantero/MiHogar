import type { RootState } from '@/store'
import type { Movement } from '@/typings/domain/types'
import { movementsSelectors } from './movementsSlice'

export const selectAllMovements = (state: RootState): Movement[] =>
  movementsSelectors.selectAll(state.movements)

export const selectMovementsByPaymentId = (state: RootState, paymentId: string): Movement[] =>
  movementsSelectors
    .selectAll(state.movements)
    .filter((movement) => movement.paymentId === paymentId)

export const selectRecentMovements = (state: RootState, limit: number): Movement[] =>
  movementsSelectors.selectAll(state.movements).slice(0, limit)

export const selectMovementsByAccountId = (state: RootState, accountId: string): Movement[] =>
  movementsSelectors
    .selectAll(state.movements)
    .filter((movement) => movement.accountId === accountId || movement.toAccountId === accountId)

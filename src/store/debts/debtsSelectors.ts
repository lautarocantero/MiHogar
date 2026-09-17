import type { RootState } from '@/store'
import type { Debt } from '@/typings/domain/types'
import { DebtDirection, DebtStatus } from '@/typings/domain/enums'
import { debtsSelectors } from './debtsSlice'

export const selectAllDebts = (state: RootState): Debt[] => debtsSelectors.selectAll(state.debts)

export const selectDebtsByDirection = (state: RootState, direction: DebtDirection): Debt[] =>
  selectAllDebts(state).filter((debt) => debt.direction === direction)

export const selectActiveDebts = (state: RootState): Debt[] =>
  selectAllDebts(state).filter((debt) => debt.status === DebtStatus.ACTIVE)

export const selectTotalOwedByHousehold = (state: RootState): number =>
  selectDebtsByDirection(state, DebtDirection.OWED_BY_HOUSEHOLD)
    .filter((debt) => debt.status === DebtStatus.ACTIVE)
    .reduce((total, debt) => total + debt.outstandingBalance, 0)

export const selectTotalOwedToHousehold = (state: RootState): number =>
  selectDebtsByDirection(state, DebtDirection.OWED_TO_HOUSEHOLD)
    .filter((debt) => debt.status === DebtStatus.ACTIVE)
    .reduce((total, debt) => total + debt.outstandingBalance, 0)

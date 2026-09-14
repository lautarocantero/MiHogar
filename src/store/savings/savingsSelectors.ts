import type { RootState } from '@/store'
import type { SavingsInstrument } from '@/typings/domain/types'
import { savingsSelectors } from './savingsSlice'

export const selectAllSavingsInstruments = (state: RootState): SavingsInstrument[] =>
  savingsSelectors.selectAll(state.savings)

export const selectTotalSaved = (state: RootState): number =>
  savingsSelectors
    .selectAll(state.savings)
    .reduce((total, instrument) => total + instrument.principal, 0)

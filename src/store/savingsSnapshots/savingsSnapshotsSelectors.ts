import type { RootState } from '@/store'
import type { SavingsSnapshot } from '@/typings/domain/types'
import { savingsSnapshotsSelectors } from './savingsSnapshotsSlice'

export const selectAllSavingsSnapshotsSortedByMonth = (state: RootState): SavingsSnapshot[] =>
  [...savingsSnapshotsSelectors.selectAll(state.savingsSnapshots)].sort((a, b) =>
    a.monthKey.localeCompare(b.monthKey)
  )

export const selectSavingsSnapshotByMonthKey = (
  state: RootState,
  monthKey: string
): SavingsSnapshot | undefined =>
  savingsSnapshotsSelectors.selectById(state.savingsSnapshots, monthKey)

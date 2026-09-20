import { useEffect } from 'react'
import { format, startOfMonth } from 'date-fns'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectSavingsSnapshotByMonthKey } from '@/store/savingsSnapshots/savingsSnapshotsSelectors'
import { upsertSavingsSnapshot } from '@/store/savingsSnapshots/savingsSnapshotsSlice'

export function useSyncSavingsSnapshot(totalSaved: number, totalInvested: number): void {
  const dispatch = useAppDispatch()
  const monthKey = format(startOfMonth(new Date()), 'yyyy-MM')
  const currentSnapshot = useAppSelector((state) =>
    selectSavingsSnapshotByMonthKey(state, monthKey)
  )

  useEffect(() => {
    const hasChanged =
      !currentSnapshot ||
      currentSnapshot.totalSaved !== totalSaved ||
      currentSnapshot.totalInvested !== totalInvested
    if (hasChanged) {
      dispatch(upsertSavingsSnapshot({ id: monthKey, monthKey, totalSaved, totalInvested }))
    }
  }, [dispatch, monthKey, totalSaved, totalInvested, currentSnapshot])
}

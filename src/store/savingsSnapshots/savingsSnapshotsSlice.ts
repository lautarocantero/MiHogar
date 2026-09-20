import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { SavingsSnapshot } from '@/typings/domain/types'

const savingsSnapshotsAdapter = createEntityAdapter<SavingsSnapshot>()

const savingsSnapshotsSlice = createSlice({
  name: 'savingsSnapshots',
  initialState: savingsSnapshotsAdapter.getInitialState(),
  reducers: {
    hydrateSavingsSnapshots: savingsSnapshotsAdapter.setAll,
    upsertSavingsSnapshot: savingsSnapshotsAdapter.upsertOne
  }
})

export const { hydrateSavingsSnapshots, upsertSavingsSnapshot } = savingsSnapshotsSlice.actions
export const savingsSnapshotsReducer = savingsSnapshotsSlice.reducer
export const savingsSnapshotsSelectors = savingsSnapshotsAdapter.getSelectors()

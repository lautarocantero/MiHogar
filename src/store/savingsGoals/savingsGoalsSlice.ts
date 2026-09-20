import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { SavingsGoal } from '@/typings/domain/types'

const savingsGoalsAdapter = createEntityAdapter<SavingsGoal>()

const savingsGoalsSlice = createSlice({
  name: 'savingsGoals',
  initialState: savingsGoalsAdapter.getInitialState(),
  reducers: {
    hydrateSavingsGoals: savingsGoalsAdapter.setAll,
    addSavingsGoal: savingsGoalsAdapter.addOne,
    updateSavingsGoal: (state, action: PayloadAction<SavingsGoal>) => {
      savingsGoalsAdapter.upsertOne(state, action.payload)
    },
    removeSavingsGoal: savingsGoalsAdapter.removeOne
  }
})

export const { hydrateSavingsGoals, addSavingsGoal, updateSavingsGoal, removeSavingsGoal } =
  savingsGoalsSlice.actions
export const savingsGoalsReducer = savingsGoalsSlice.reducer
export const savingsGoalsSelectors = savingsGoalsAdapter.getSelectors()

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { SavingsInstrument } from '@/typings/domain/types'

const savingsAdapter = createEntityAdapter<SavingsInstrument>()

const savingsSlice = createSlice({
  name: 'savings',
  initialState: savingsAdapter.getInitialState(),
  reducers: {
    hydrateSavings: savingsAdapter.setAll,
    addSavingsInstrument: savingsAdapter.addOne,
    updateSavingsInstrument: (state, action: PayloadAction<SavingsInstrument>) => {
      savingsAdapter.upsertOne(state, action.payload)
    },
    removeSavingsInstrument: savingsAdapter.removeOne
  }
})

export const {
  hydrateSavings,
  addSavingsInstrument,
  updateSavingsInstrument,
  removeSavingsInstrument
} = savingsSlice.actions
export const savingsReducer = savingsSlice.reducer
export const savingsSelectors = savingsAdapter.getSelectors()

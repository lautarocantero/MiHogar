import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Debt } from '@/typings/domain/types'

const debtsAdapter = createEntityAdapter<Debt>()

const debtsSlice = createSlice({
  name: 'debts',
  initialState: debtsAdapter.getInitialState(),
  reducers: {
    hydrateDebts: debtsAdapter.setAll,
    addDebt: debtsAdapter.addOne,
    updateDebt: (state, action: PayloadAction<Debt>) => {
      debtsAdapter.upsertOne(state, action.payload)
    },
    removeDebt: debtsAdapter.removeOne
  }
})

export const { hydrateDebts, addDebt, updateDebt, removeDebt } = debtsSlice.actions
export const debtsReducer = debtsSlice.reducer
export const debtsSelectors = debtsAdapter.getSelectors()

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Movement } from '@/typings/domain/types'

const movementsAdapter = createEntityAdapter<Movement>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const movementsSlice = createSlice({
  name: 'movements',
  initialState: movementsAdapter.getInitialState(),
  reducers: {
    hydrateMovements: movementsAdapter.setAll,
    addMovement: movementsAdapter.addOne,
    updateMovement: (state, action: PayloadAction<Movement>) => {
      movementsAdapter.upsertOne(state, action.payload)
    },
    removeMovement: movementsAdapter.removeOne
  }
})

export const { hydrateMovements, addMovement, updateMovement, removeMovement } =
  movementsSlice.actions
export const movementsReducer = movementsSlice.reducer
export const movementsSelectors = movementsAdapter.getSelectors()

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Household } from '@/typings/domain/types'

const initialState: Household = { name: '' }

const householdSlice = createSlice({
  name: 'household',
  initialState,
  reducers: {
    hydrateHousehold: (_state, action: PayloadAction<Household>) => action.payload,
    setHouseholdName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    }
  }
})

export const { hydrateHousehold, setHouseholdName } = householdSlice.actions
export const householdReducer = householdSlice.reducer

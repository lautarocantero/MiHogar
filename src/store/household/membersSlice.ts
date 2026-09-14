import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { HouseholdMember } from '@/typings/domain/types'

const membersAdapter = createEntityAdapter<HouseholdMember>()

const membersSlice = createSlice({
  name: 'members',
  initialState: membersAdapter.getInitialState(),
  reducers: {
    hydrateMembers: membersAdapter.setAll,
    addMember: membersAdapter.addOne,
    updateMember: (state, action: PayloadAction<HouseholdMember>) => {
      membersAdapter.upsertOne(state, action.payload)
    },
    removeMember: membersAdapter.removeOne
  }
})

export const { hydrateMembers, addMember, updateMember, removeMember } = membersSlice.actions
export const membersReducer = membersSlice.reducer
export const membersSelectors = membersAdapter.getSelectors()

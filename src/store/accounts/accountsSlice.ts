import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Account } from '@/typings/domain/types'

const accountsAdapter = createEntityAdapter<Account>()

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: accountsAdapter.getInitialState(),
  reducers: {
    hydrateAccounts: accountsAdapter.setAll,
    addAccount: accountsAdapter.addOne,
    updateAccount: (state, action: PayloadAction<Account>) => {
      accountsAdapter.upsertOne(state, action.payload)
    },
    removeAccount: accountsAdapter.removeOne
  }
})

export const { hydrateAccounts, addAccount, updateAccount, removeAccount } = accountsSlice.actions
export const accountsReducer = accountsSlice.reducer
export const accountsSelectors = accountsAdapter.getSelectors()

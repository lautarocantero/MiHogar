import { combineReducers } from '@reduxjs/toolkit'
import { vaultReducer } from './vault/vaultSlice'
import { householdReducer } from './household/householdSlice'
import { membersReducer } from './household/membersSlice'
import { accountsReducer } from './accounts/accountsSlice'
import { paymentsReducer } from './payments/paymentsSlice'
import { movementsReducer } from './movements/movementsSlice'
import { savingsReducer } from './savings/savingsSlice'
import { categoriesReducer } from './categories/categoriesSlice'
import { uiReducer } from './ui/uiSlice'

export const rootReducer = combineReducers({
  vault: vaultReducer,
  household: householdReducer,
  members: membersReducer,
  accounts: accountsReducer,
  payments: paymentsReducer,
  movements: movementsReducer,
  savings: savingsReducer,
  categories: categoriesReducer,
  ui: uiReducer
})

export type RootState = ReturnType<typeof rootReducer>

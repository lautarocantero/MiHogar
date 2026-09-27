import { combineReducers } from '@reduxjs/toolkit'
import { vaultReducer } from './vault/vaultSlice'
import { householdReducer } from './household/householdSlice'
import { membersReducer } from './household/membersSlice'
import { accountsReducer } from './accounts/accountsSlice'
import { paymentsReducer } from './payments/paymentsSlice'
import { movementsReducer } from './movements/movementsSlice'
import { savingsReducer } from './savings/savingsSlice'
import { categoriesReducer } from './categories/categoriesSlice'
import { notificationsReducer } from './notifications/notificationsSlice'
import { debtsReducer } from './debts/debtsSlice'
import { savingsGoalsReducer } from './savingsGoals/savingsGoalsSlice'
import { savingsSnapshotsReducer } from './savingsSnapshots/savingsSnapshotsSlice'
import { uiReducer } from './ui/uiSlice'
import { tasksReducer } from './tasks/tasksSlice'
import { taskCategoriesReducer } from './taskCategories/taskCategoriesSlice'

export const rootReducer = combineReducers({
  vault: vaultReducer,
  household: householdReducer,
  members: membersReducer,
  accounts: accountsReducer,
  payments: paymentsReducer,
  movements: movementsReducer,
  savings: savingsReducer,
  categories: categoriesReducer,
  notifications: notificationsReducer,
  debts: debtsReducer,
  savingsGoals: savingsGoalsReducer,
  savingsSnapshots: savingsSnapshotsReducer,
  ui: uiReducer,
  tasks: tasksReducer,
  taskCategories: taskCategoriesReducer
})

export type RootState = ReturnType<typeof rootReducer>

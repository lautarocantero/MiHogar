import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { persistenceMiddleware } from './middleware/persistenceMiddleware'
import { tasksPersistenceMiddleware } from './middleware/tasksPersistenceMiddleware'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware, tasksPersistenceMiddleware)
})

export type { RootState } from './rootReducer'
export type { AppDispatch } from './appDispatch'

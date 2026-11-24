import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { persistenceMiddleware } from './middleware/persistenceMiddleware'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistenceMiddleware),
  // El estado tiene los datos del hogar en claro: DevTools solo en desarrollo.
  devTools: import.meta.env.DEV
})

export type { RootState } from './rootReducer'
export type { AppDispatch } from './appDispatch'

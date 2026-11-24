import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SaveStatus } from './typings/enums'
import type { PendingExitReason } from './typings/enums'
import type { UiState } from './typings/types'

const initialState: UiState = {
  saveStatus: SaveStatus.IDLE,
  errorMessage: null,
  toast: null,
  pendingExit: null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSaveStatus: (state, action: PayloadAction<SaveStatus>) => {
      state.saveStatus = action.payload
    },
    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.toast = { message: action.payload, key: Date.now() }
    },
    clearToast: (state) => {
      state.toast = null
    },
    setPendingExit: (state, action: PayloadAction<PendingExitReason | null>) => {
      state.pendingExit = action.payload
    }
  }
})

export const { setSaveStatus, setErrorMessage, showToast, clearToast, setPendingExit } =
  uiSlice.actions
export const uiReducer = uiSlice.reducer

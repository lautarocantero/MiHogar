import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SaveStatus } from './typings/enums'
import type { UiState } from './typings/types'

const initialState: UiState = {
  saveStatus: SaveStatus.IDLE,
  errorMessage: null,
  toast: null
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
    }
  }
})

export const { setSaveStatus, setErrorMessage, showToast, clearToast } = uiSlice.actions
export const uiReducer = uiSlice.reducer

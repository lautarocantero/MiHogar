import type { RootState } from '@/store'
import type { SaveStatus } from './typings/enums'
import type { ToastState } from './typings/types'

export const selectSaveStatus = (state: RootState): SaveStatus => state.ui.saveStatus

export const selectErrorMessage = (state: RootState): string | null => state.ui.errorMessage

export const selectToast = (state: RootState): ToastState | null => state.ui.toast

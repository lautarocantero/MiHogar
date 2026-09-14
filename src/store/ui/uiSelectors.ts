import type { RootState } from '@/store'
import type { SaveStatus } from './typings/enums'

export const selectSaveStatus = (state: RootState): SaveStatus => state.ui.saveStatus

export const selectErrorMessage = (state: RootState): string | null => state.ui.errorMessage

import type { SaveStatus } from './enums'

export type ToastState = {
  message: string
  key: number
}

export type UiState = {
  saveStatus: SaveStatus
  errorMessage: string | null
  toast: ToastState | null
}

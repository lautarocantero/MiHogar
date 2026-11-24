import type { PendingExitReason, SaveStatus } from './enums'

export type ToastState = {
  message: string
  key: number
}

export type UiState = {
  saveStatus: SaveStatus
  errorMessage: string | null
  toast: ToastState | null
  /** Salida frenada por cambios sin guardar (abre el diálogo "Tenés cambios sin guardar"). */
  pendingExit: PendingExitReason | null
}

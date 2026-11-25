import type { PendingExitReason } from '@/store/ui/typings/enums'

export type UseLoaderResult = {
  isLoading: boolean
  error: string | null
  run: <T>(action: () => Promise<T>, fallbackMessage: string) => Promise<T | undefined>
  /** Borra el error visible (por ejemplo al cambiar de pantalla). */
  reset: () => void
}

export type UseExitDemoModeResult = {
  exitDemo: () => void
  isExiting: boolean
}

export type UseSignOutResult = {
  signOut: () => void
  isSigningOut: boolean
  errorMessage: string | null
}

export type UseRestoreVaultBackupResult = {
  /** Abre el selector de archivos; si el archivo es válido pide la clave del hogar. */
  pickBackup: () => void
  /** Respaldo elegido esperando la clave (controla el diálogo). */
  isAwaitingKey: boolean
  submitKey: (householdKey: string) => void
  cancel: () => void
  isRestoring: boolean
  /** Error dentro del diálogo (clave incorrecta, sin red...). */
  errorMessage: string | null
  /** Error al elegir el archivo (no es un respaldo de Gastito). */
  pickErrorMessage: string | null
}

export type UseSyncConflictResolutionResult = {
  /** Hay un conflicto pendiente: el diálogo tiene que estar abierto. */
  isOpen: boolean
  keepLocal: () => void
  applyRemote: () => void
  exportLocal: () => void
  isWorking: boolean
  errorMessage: string | null
  message: string | null
}

export type UsePendingExitResolutionResult = {
  pendingExit: PendingExitReason | null
  /** Se puede reintentar guardar (no aplica si la sesión terminó o cambió la clave). */
  canRetry: boolean
  retry: () => void
  discard: () => void
  exportBackup: () => void
  isWorking: boolean
  errorMessage: string | null
  message: string | null
}

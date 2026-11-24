import type { VaultFile } from '@/typings/domain/types'

/**
 * Puente entre los thunks y la cola de guardado del `persistenceMiddleware`. Los thunks
 * importan este módulo (no el middleware) para no generar una dependencia circular; el
 * middleware registra la implementación real al crearse el store.
 */

/** Versión remota que chocó con los cambios locales (conflicto pendiente de resolver). */
export type RemoteVaultSnapshot = {
  vaultFile: VaultFile
  version: number
}

export type VaultSaveController = {
  /** Sube ya los cambios pendientes y espera. Resuelve `true` si quedó todo guardado. */
  flush: () => Promise<boolean>
  /** Marca el estado como modificado y lo sube ya. Rechaza si no se pudo guardar. */
  saveNow: () => Promise<void>
  hasPending: () => boolean
  /** Olvida los cambios pendientes (al bloquear, cerrar sesión o rehidratar). */
  discard: () => void
  /** El conflicto pendiente (otro dispositivo guardó encima), si hay. */
  getConflict: () => RemoteVaultSnapshot | null
  /** "Quedarme con mis cambios": sube el estado local encima de la versión remota. */
  keepLocalOverConflict: () => Promise<boolean>
}

let controller: VaultSaveController | null = null

export function registerVaultSaveController(next: VaultSaveController): void {
  controller = next
}

export function flushPendingVaultSave(timeoutMs = 8000): Promise<boolean> {
  if (!controller) return Promise.resolve(true)
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    controller.flush(),
    new Promise<boolean>((resolve) => {
      timeoutId = setTimeout(() => resolve(false), timeoutMs)
    })
  ]).finally(() => clearTimeout(timeoutId))
}

export function saveVaultNow(): Promise<void> {
  return controller ? controller.saveNow() : Promise.resolve()
}

export function hasPendingVaultSave(): boolean {
  return controller?.hasPending() ?? false
}

export function discardPendingVaultSave(): void {
  controller?.discard()
}

export function getPendingVaultConflict(): RemoteVaultSnapshot | null {
  return controller?.getConflict() ?? null
}

export function keepLocalChangesOverConflict(): Promise<boolean> {
  return controller ? controller.keepLocalOverConflict() : Promise.resolve(true)
}

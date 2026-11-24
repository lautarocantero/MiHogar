import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/store'
import { VaultStatus } from '@/store/vault/typings/enums'
import { buildValidatedVaultFile, reloadRemoteVaultThunk } from '@/store/vault/vaultThunks'
import { parseVaultFile } from '@/store/vault/parseVaultFile'
import { setSaveStatus, setErrorMessage, setPendingExit } from '@/store/ui/uiSlice'
import { PendingExitReason, SaveStatus } from '@/store/ui/typings/enums'
import {
  commitKnownVaultVersion,
  downloadRemoteVault,
  fetchRemoteVaultVersion,
  getKnownVaultVersion,
  saveVaultFile
} from '@/apis/vaultApi'
import {
  AppError,
  InvalidHouseholdKeyError,
  VaultConflictError,
  describeError,
  isNetworkError,
  isOffline
} from '@/apis/cloud/errors'
import { isDesktopApp } from '@/apis/cloud/browserFiles'
import { registerVaultSaveController } from './vaultSaveControl'
import type { RemoteVaultSnapshot } from './vaultSaveControl'

/**
 * Guardado automático del vault en la nube:
 * - agrupa los cambios (debounce) y nunca tiene dos guardados en vuelo a la vez;
 * - fuerza el guardado pendiente al ocultar/cerrar la pestaña y avisa en `beforeunload`;
 * - ante un conflicto (otro dispositivo guardó antes) NO descarta lo local: baja la
 *   versión remota y deja que el usuario elija (diálogo de conflicto);
 * - al volver a la pestaña, si no hay cambios locales, trae los cambios de otros dispositivos;
 * - sin red queda en OFFLINE / ERROR y reintenta con backoff y al volver la conexión.
 */
const MUTATING_ACTION_PREFIXES = [
  'household/',
  'members/',
  'accounts/',
  'payments/',
  'movements/',
  'savings/',
  'categories/',
  'categoryRules/',
  'notifications/',
  'debts/',
  'savingsGoals/',
  'savingsSnapshots/'
]

const HYDRATE_ACTION_SUFFIX = /^hydrate/
const SAVE_DEBOUNCE_MS = 800
const RETRY_DELAYS_MS = [2_000, 5_000, 15_000, 30_000, 60_000]
const REMOTE_CHECK_MIN_INTERVAL_MS = 5_000
const INVALID_DATA_ERROR_CODE = 'vaultErrors.invalidData'

/** Salidas en las que ya no se puede guardar (sesión vencida, clave cambiada). */
const SAVE_BLOCKING_EXITS = new Set<PendingExitReason>([
  PendingExitReason.SESSION_ENDED,
  PendingExitReason.KEY_CHANGED
])

type StoreApi = MiddlewareAPI<AppDispatch, RootState>

function isMutatingAction(actionType: string): boolean {
  const [, actionName] = actionType.split('/')
  if (!actionName || HYDRATE_ACTION_SUFFIX.test(actionName)) {
    return false
  }
  return MUTATING_ACTION_PREFIXES.some((prefix) => actionType.startsWith(prefix))
}

function createSaveQueue(storeApi: StoreApi): {
  markDirty: () => void
  flush: () => Promise<boolean>
  saveNow: () => Promise<void>
  hasPending: () => boolean
  discard: () => void
  getConflict: () => RemoteVaultSnapshot | null
  keepLocalOverConflict: () => Promise<boolean>
  checkRemoteForUpdates: () => void
  retry: () => void
} {
  let isDirty = false
  let inFlight: Promise<boolean> | null = null
  let debounceTimer: number | undefined
  let retryTimer: number | undefined
  let retryAttempt = 0
  let lastError: unknown = null
  let lastRemoteCheckAt = 0
  let isCheckingRemote = false
  let conflict: RemoteVaultSnapshot | null = null

  const setStatus = (status: SaveStatus): void => {
    if (storeApi.getState().ui.saveStatus !== status) {
      storeApi.dispatch(setSaveStatus(status))
    }
  }

  const isUnlocked = (): boolean => storeApi.getState().vault.status === VaultStatus.UNLOCKED

  const canSave = (): boolean => {
    const { pendingExit } = storeApi.getState().ui
    return (
      isUnlocked() && conflict === null && !(pendingExit && SAVE_BLOCKING_EXITS.has(pendingExit))
    )
  }

  const clearTimers = (): void => {
    window.clearTimeout(debounceTimer)
    window.clearTimeout(retryTimer)
    debounceTimer = undefined
    retryTimer = undefined
  }

  const scheduleRetry = (): void => {
    window.clearTimeout(retryTimer)
    const delay = RETRY_DELAYS_MS[Math.min(retryAttempt, RETRY_DELAYS_MS.length - 1)]
    retryAttempt += 1
    retryTimer = window.setTimeout(() => {
      retryTimer = undefined
      void run()
    }, delay)
  }

  /**
   * Otro dispositivo guardó antes. Los cambios locales siguen pendientes (nunca se
   * descartan acá): se baja la versión remota y se abre el diálogo para elegir.
   */
  const handleConflict = async (): Promise<void> => {
    isDirty = true
    lastError = new VaultConflictError()
    try {
      const remote = await downloadRemoteVault()
      const { vaultFile } = parseVaultFile(remote.vaultJson)
      if (!isUnlocked()) return
      conflict = { vaultFile, version: remote.version }
      setStatus(SaveStatus.CONFLICT)
    } catch (error) {
      if (error instanceof InvalidHouseholdKeyError) {
        // La clave del hogar cambió en otro dispositivo: ya no se puede guardar con esta
        // sesión. Se ofrece descargar lo local antes de cerrar.
        storeApi.dispatch(setPendingExit(PendingExitReason.KEY_CHANGED))
        setStatus(SaveStatus.ERROR)
        return
      }
      lastError = error
      setStatus(isNetworkError(error) || isOffline() ? SaveStatus.OFFLINE : SaveStatus.ERROR)
      scheduleRetry()
    }
  }

  const saveLoop = async (): Promise<boolean> => {
    while (isDirty && canSave()) {
      isDirty = false
      setStatus(SaveStatus.SAVING)
      try {
        await saveVaultFile(buildValidatedVaultFile(storeApi.getState()))
        retryAttempt = 0
        lastError = null
      } catch (error) {
        if (error instanceof VaultConflictError) {
          await handleConflict()
          return false
        }
        isDirty = true
        lastError = error
        const offline = isNetworkError(error) || isOffline()
        setStatus(offline ? SaveStatus.OFFLINE : SaveStatus.ERROR)
        if (!offline) {
          storeApi.dispatch(setErrorMessage(describeError(error, 'sync.saveFailed')))
        }
        // Datos inválidos: reintentar no sirve; se vuelve a intentar con el próximo cambio.
        const isInvalidData = error instanceof AppError && error.code === INVALID_DATA_ERROR_CODE
        if (!isInvalidData) scheduleRetry()
        return false
      }
    }
    if (!isDirty && canSave()) {
      setStatus(SaveStatus.SAVED)
    }
    return !isDirty
  }

  function run(): Promise<boolean> {
    window.clearTimeout(debounceTimer)
    debounceTimer = undefined
    if (!inFlight) {
      inFlight = saveLoop().finally(() => {
        inFlight = null
      })
    }
    return inFlight
  }

  const markDirty = (): void => {
    isDirty = true
    // Con el diálogo de conflicto abierto el estado sigue siendo CONFLICT.
    if (!inFlight && !conflict) setStatus(SaveStatus.PENDING)
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => void run(), SAVE_DEBOUNCE_MS)
  }

  const flush = async (): Promise<boolean> => {
    if (inFlight) await inFlight
    if (!isDirty) return true
    window.clearTimeout(retryTimer)
    return run()
  }

  const saveNow = async (): Promise<void> => {
    isDirty = true
    const saved = await flush()
    if (!saved) {
      throw lastError ?? new Error('save failed')
    }
  }

  const discard = (): void => {
    isDirty = false
    retryAttempt = 0
    lastError = null
    conflict = null
    clearTimers()
  }

  const keepLocalOverConflict = async (): Promise<boolean> => {
    if (inFlight) await inFlight
    if (conflict) {
      commitKnownVaultVersion(conflict.version)
      conflict = null
    }
    isDirty = true
    retryAttempt = 0
    window.clearTimeout(retryTimer)
    return run()
  }

  const checkRemoteForUpdates = (): void => {
    if (
      !canSave() ||
      isDirty ||
      inFlight ||
      debounceTimer ||
      isCheckingRemote ||
      isOffline()
    ) {
      return
    }
    const now = Date.now()
    if (now - lastRemoteCheckAt < REMOTE_CHECK_MIN_INTERVAL_MS) return
    lastRemoteCheckAt = now
    isCheckingRemote = true
    void (async (): Promise<void> => {
      try {
        const knownVersion = getKnownVaultVersion()
        const remoteVersion = await fetchRemoteVaultVersion()
        if (
          knownVersion !== null &&
          remoteVersion !== null &&
          remoteVersion > knownVersion &&
          !isDirty &&
          !inFlight
        ) {
          // El thunk vuelve a mirar si hay cambios locales justo antes de rehidratar.
          await storeApi.dispatch(reloadRemoteVaultThunk('remoteNewer')).unwrap()
        }
      } catch {
        // Sin red o sin sesión: se vuelve a intentar en el próximo foco.
      } finally {
        isCheckingRemote = false
      }
    })()
  }

  const retry = (): void => {
    retryAttempt = 0
    window.clearTimeout(retryTimer)
    if (isDirty) void run()
  }

  return {
    markDirty,
    flush,
    saveNow,
    hasPending: () => isDirty || inFlight !== null,
    discard,
    getConflict: () => conflict,
    keepLocalOverConflict,
    checkRemoteForUpdates,
    retry
  }
}

let retryPendingSaveImpl: () => void = () => undefined

/** Reintenta ya el guardado que falló (botón "Reintentar" del indicador de sincronización). */
export function retryPendingVaultSave(): void {
  retryPendingSaveImpl()
}

function installWindowListeners(queue: ReturnType<typeof createSaveQueue>): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  // En mobile cerrar la pestaña casi nunca dispara `beforeunload`: al ocultarse (cambiar
  // de app, bloquear la pantalla) se sube lo pendiente sin esperar el debounce.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      void queue.flush()
    } else {
      queue.checkRemoteForUpdates()
    }
  })
  document.addEventListener('freeze', () => {
    void queue.flush()
  })
  window.addEventListener('pagehide', () => {
    void queue.flush()
  })
  window.addEventListener('focus', () => queue.checkRemoteForUpdates())
  window.addEventListener('online', () => {
    queue.retry()
    queue.checkRemoteForUpdates()
  })
  window.addEventListener('beforeunload', (event) => {
    // En Electron cancelar beforeunload cierra sin diálogo y deja la ventana sin poder
    // cerrarse si no hay red: ahí solo se intenta subir lo pendiente.
    if (queue.hasPending()) {
      if (isDesktopApp()) {
        void queue.flush()
        return
      }
      void queue.flush()
      event.preventDefault()
      // Chrome necesita returnValue para mostrar el aviso.
      event.returnValue = ''
    }
  })
}

export const persistenceMiddleware: Middleware<object, RootState, AppDispatch> = (storeApi) => {
  const queue = createSaveQueue(storeApi)
  registerVaultSaveController({
    flush: queue.flush,
    saveNow: queue.saveNow,
    hasPending: queue.hasPending,
    discard: queue.discard,
    getConflict: queue.getConflict,
    keepLocalOverConflict: queue.keepLocalOverConflict
  })
  retryPendingSaveImpl = queue.retry
  installWindowListeners(queue)

  return (next) => (action) => {
    const result = next(action)

    const actionType =
      typeof action === 'object' && action !== null ? (action as { type?: string }).type : undefined
    if (!actionType || !isMutatingAction(actionType)) {
      return result
    }

    if (storeApi.getState().vault.status !== VaultStatus.UNLOCKED) {
      return result
    }

    queue.markDirty()
    return result
  }
}

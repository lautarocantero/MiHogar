import { t } from '@/i18n'

/**
 * Errores con mensaje para el usuario. `code` es la clave de i18n: sobrevive a la
 * serialización de `createAsyncThunk` (que conserva `name`, `message` y `code`), así
 * que `useHandleError` puede traducirlo aunque el error llegue como objeto plano.
 */
export const APP_ERROR_NAME = 'MiHogarAppError'

export class AppError extends Error {
  readonly code: string

  constructor(code: string, options?: { cause?: unknown }) {
    super(t(code))
    this.name = APP_ERROR_NAME
    this.code = code
    if (options?.cause !== undefined) {
      ;(this as { cause?: unknown }).cause = options.cause
    }
  }
}

export class InvalidHouseholdKeyError extends AppError {
  constructor() {
    super('vaultErrors.invalidKey')
  }
}

export class VaultConflictError extends AppError {
  constructor() {
    super('vaultErrors.conflict')
  }
}

export class VaultNotUnlockedError extends AppError {
  constructor() {
    super('vaultErrors.notUnlocked')
  }
}

export class VaultNotFoundError extends AppError {
  constructor() {
    super('vaultErrors.notFound')
  }
}

export class VaultAlreadyExistsError extends AppError {
  constructor() {
    super('vaultErrors.alreadyExists')
  }
}

export class InvalidBackupFileError extends AppError {
  constructor() {
    super('vaultErrors.invalidBackup')
  }
}

export class CloudConfigError extends AppError {
  constructor() {
    super('cloudErrors.notConfigured')
  }
}

export class NotSignedInError extends AppError {
  constructor() {
    super('cloudErrors.notSignedIn')
  }
}

export class CloudRequestError extends AppError {
  readonly isNetworkError: boolean

  constructor(isNetworkError: boolean, cause?: unknown) {
    super(isNetworkError ? 'cloudErrors.network' : 'cloudErrors.generic', { cause })
    this.isNetworkError = isNetworkError
  }
}

const NETWORK_ERROR_PATTERN =
  /failed to fetch|networkerror|load failed|network request failed|fetch failed/i

export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

/** Convierte el `error` que devuelven postgrest/storage en un `CloudRequestError`. */
export function toCloudError(error: unknown): CloudRequestError {
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error)
  return new CloudRequestError(isOffline() || NETWORK_ERROR_PATTERN.test(message), error)
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof CloudRequestError) return error.isNetworkError
  if (error instanceof TypeError) return NETWORK_ERROR_PATTERN.test(error.message) || isOffline()
  return false
}

/** Mensaje traducido si el error (instancia u objeto serializado) es un `AppError`. */
export function resolveAppErrorMessage(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) return null
  const { name, code } = error as { name?: unknown; code?: unknown }
  if (name === APP_ERROR_NAME && typeof code === 'string') {
    return t(code)
  }
  return null
}

/** Mensaje traducido para mostrar: el del `AppError` o, si no, el de `fallbackKey`. */
export function describeError(error: unknown, fallbackKey: string): string {
  return resolveAppErrorMessage(error) ?? t(fallbackKey)
}

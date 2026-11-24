import { isAuthError } from '@supabase/supabase-js'
import type { AuthChangeEvent, User } from '@supabase/supabase-js'
import { getSupabase } from './cloud/supabaseClient'
import { AppError, CloudRequestError, NotSignedInError, isOffline } from './cloud/errors'
import { isDesktopApp } from './cloud/browserFiles'

export type AuthUser = {
  id: string
  email: string | null
}

function toAuthUser(user: User | null | undefined): AuthUser | null {
  return user ? { id: user.id, email: user.email ?? null } : null
}

const AUTH_ERROR_CODES: Record<string, string> = {
  invalid_credentials: 'auth.errors.invalidCredentials',
  email_not_confirmed: 'auth.errors.emailNotConfirmed',
  user_already_exists: 'auth.errors.userExists',
  email_exists: 'auth.errors.userExists',
  weak_password: 'auth.errors.weakPassword',
  same_password: 'auth.errors.samePassword',
  // EMAILS DESACTIVADOS: con "Confirm email" prendido en Supabase, crear cuenta manda un mail
  // igual y agota la cuota; la causa real es la confirmación pendiente. Al reactivar los mails
  // vuelve a ser 'auth.errors.rateLimited'.
  over_email_send_rate_limit: 'auth.errors.confirmationRequired',
  over_request_rate_limit: 'auth.errors.rateLimited',
  email_address_invalid: 'auth.errors.invalidEmail',
  signup_disabled: 'auth.errors.signupDisabled'
}

/** Traduce un error de Supabase Auth a un `AppError` con mensaje para el usuario. */
function toAuthAppError(error: unknown): AppError {
  if (isAuthError(error)) {
    const mapped = error.code ? AUTH_ERROR_CODES[error.code] : undefined
    if (mapped) return new AppError(mapped, { cause: error })
    if (error.status === 429) return new AppError('auth.errors.rateLimited', { cause: error })
    if (error.status === 400 && /invalid login credentials/i.test(error.message)) {
      return new AppError('auth.errors.invalidCredentials', { cause: error })
    }
    if (error.name === 'AuthRetryableFetchError' || isOffline()) {
      return new CloudRequestError(true, error)
    }
  }
  if (error instanceof AppError) return error
  if (error instanceof TypeError || isOffline()) return new CloudRequestError(true, error)
  return new AppError('auth.errors.generic', { cause: error })
}

/**
 * URL a la que vuelven los links de los emails. En la web es la página actual; en
 * Electron (file://) no hay URL pública, así que se usa la "Site URL" del proyecto.
 */
function resolveRedirectUrl(): string | undefined {
  if (typeof window === 'undefined' || isDesktopApp()) return undefined
  const { protocol, origin, pathname } = window.location
  if (protocol !== 'https:' && protocol !== 'http:') return undefined
  return `${origin}${pathname}`
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const { data, error } = await getSupabase().auth.getSession()
  if (error) throw toAuthAppError(error)
  return toAuthUser(data.session?.user)
}

export async function requireCurrentUserId(): Promise<string> {
  const user = await getCurrentAuthUser()
  if (!user) throw new NotSignedInError()
  return user.id
}

/**
 * Se suscribe a los cambios de sesión. El callback NO debe llamar a Supabase de forma
 * sincrónica (supabase-js puede bloquearse); solo despachar acciones.
 */
export function subscribeToAuthChanges(
  callback: (event: AuthChangeEvent, user: AuthUser | null) => void
): () => void {
  const { data } = getSupabase().auth.onAuthStateChange((event, session) => {
    callback(event, toAuthUser(session?.user))
  })
  return () => data.subscription.unsubscribe()
}

export async function signInWithPassword(email: string, password: string): Promise<AuthUser> {
  try {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) throw error
    const user = toAuthUser(data.user)
    if (!user) throw new AppError('auth.errors.generic')
    return user
  } catch (error) {
    throw toAuthAppError(error)
  }
}

export type SignUpResult = {
  /** `true` si Supabase exige confirmar el email antes de poder entrar. */
  needsEmailConfirmation: boolean
}

export async function signUpWithPassword(email: string, password: string): Promise<SignUpResult> {
  try {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password
      // EMAILS DESACTIVADOS (todavía no hay envío de mails): reactivar el link de confirmación.
      // options: { emailRedirectTo: resolveRedirectUrl() }
    })
    if (error) throw error
    // Con confirmación de email activa no hay sesión hasta hacer click en el link.
    // (Si el email ya existía, Supabase responde igual para no revelar cuentas.)
    return { needsEmailConfirmation: !data.session }
  } catch (error) {
    throw toAuthAppError(error)
  }
}

// EMAILS DESACTIVADOS: `resendSignUpEmail` y `sendPasswordResetEmail` quedan sin uso desde la UI
// hasta que haya envío de mails (ver `AccountAccessPage`).
export async function resendSignUpEmail(email: string): Promise<void> {
  try {
    const { error } = await getSupabase().auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: resolveRedirectUrl() }
    })
    if (error) throw error
  } catch (error) {
    throw toAuthAppError(error)
  }
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: resolveRedirectUrl()
    })
    if (error) throw error
  } catch (error) {
    throw toAuthAppError(error)
  }
}

export async function updateAccountPassword(newPassword: string): Promise<void> {
  try {
    const { error } = await getSupabase().auth.updateUser({ password: newPassword })
    if (error) throw error
  } catch (error) {
    throw toAuthAppError(error)
  }
}

export async function signOutFromCloud(): Promise<void> {
  try {
    // `local`: cierra la sesión de este dispositivo aunque no haya red.
    const { error } = await getSupabase().auth.signOut({ scope: 'local' })
    if (error) throw error
  } catch (error) {
    throw toAuthAppError(error)
  }
}

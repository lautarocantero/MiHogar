import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/store'
import {
  getCurrentAuthUser,
  resendSignUpEmail,
  sendPasswordResetEmail,
  signInWithPassword,
  signOutFromCloud,
  signUpWithPassword,
  subscribeToAuthChanges,
  updateAccountPassword
} from '@/apis/authApi'
import type { SignUpResult } from '@/apis/authApi'
import {
  clearAuthErrorFromLocation,
  isCloudConfigured,
  readAuthRedirectState
} from '@/apis/cloud/supabaseClient'
import { getVaultSession } from '@/apis/cloud/vaultSession'
import { flushPendingVaultSave, hasPendingVaultSave } from '@/store/middleware/vaultSaveControl'
import {
  closeAfterRemoteKeyChangeThunk,
  exitDemoModeThunk,
  lockVaultThunk,
  resetVaultThunk
} from '@/store/vault/vaultThunks'
import { VaultStatus } from '@/store/vault/typings/enums'
import { setPendingExit } from '@/store/ui/uiSlice'
import { PendingExitReason } from '@/store/ui/typings/enums'
import type { Sensitive } from '@/utils/sensitive'
import {
  authConfigMissing,
  authInitialized,
  authPasswordRecoveryCompleted,
  // authPasswordRecoveryStarted, // EMAILS DESACTIVADOS
  authSignedIn,
  authSignedOut
} from './authSlice'
import type { AuthCredentials } from './typings/types'

const thunkTypes = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()

let isListening = false

/**
 * Lee la sesión guardada y se suscribe a los cambios (login en otra pestaña, sesión
 * vencida, link de recuperación). Se puede llamar más de una vez (StrictMode).
 */
export const initAuthThunk = thunkTypes('auth/init', async (_: void, { dispatch, getState }) => {
  if (!isCloudConfigured()) {
    dispatch(authConfigMissing())
    return
  }

  const redirect = readAuthRedirectState()
  // EMAILS DESACTIVADOS: sin mails no hay link de recuperación legítimo; un `#type=recovery`
  // armado a mano no tiene que abrir "Elegí tu contraseña nueva". Al reactivar los mails, volver
  // a pasar `redirect.isRecovery` a `authInitialized` y limpiar solo con `hasLinkError`.
  if (redirect.hasLinkError || redirect.isRecovery) clearAuthErrorFromLocation()

  if (!isListening) {
    isListening = true
    subscribeToAuthChanges((event, user) => {
      const state = getState()
      const previousUserId = state.auth.user?.id ?? getVaultSession()?.userId ?? null

      // Sesión vencida / cerrada en otra pestaña / otra cuenta con cambios sin subir: ya
      // no se pueden guardar, pero tampoco se tiran sin avisar. Se deja el vault abierto
      // (sin guardar) y se ofrece descargar un respaldo antes de salir.
      const hasUnsavedChanges = state.vault.status === VaultStatus.UNLOCKED && hasPendingVaultSave()

      if (event === 'SIGNED_OUT' || !user) {
        if (hasUnsavedChanges) {
          dispatch(setPendingExit(PendingExitReason.SESSION_ENDED))
          return
        }
        dispatch(authSignedOut())
        if (state.vault.status !== VaultStatus.DEMO) void dispatch(resetVaultThunk())
        return
      }
      // Otra cuenta en la misma pestaña: no puede quedar abierto el vault de la anterior.
      if (previousUserId && previousUserId !== user.id) {
        if (hasUnsavedChanges) {
          dispatch(setPendingExit(PendingExitReason.SESSION_ENDED))
          return
        }
        void dispatch(resetVaultThunk())
      }
      // EMAILS DESACTIVADOS: sin mails de recuperación, PASSWORD_RECOVERY se trata como un login
      // normal. Reactivar con:
      // if (event === 'PASSWORD_RECOVERY') {
      //   dispatch(authPasswordRecoveryStarted(user))
      //   return
      // }
      dispatch(authSignedIn(user))
    })
  }

  let user = null
  try {
    user = await getCurrentAuthUser()
  } catch {
    user = null
  }
  dispatch(authInitialized({ user, isRecovery: false, hasLinkError: redirect.hasLinkError }))
})

/*
 * Las credenciales llegan envueltas en `Sensitive` para que no queden legibles en
 * `action.meta.arg` (DevTools, logs).
 */
export const signInThunk = thunkTypes(
  'auth/signIn',
  async (credentials: Sensitive<AuthCredentials>, { dispatch }) => {
    const { email, password } = credentials.reveal()
    const user = await signInWithPassword(email.trim(), password)
    dispatch(authSignedIn(user))
  }
)

export const signUpThunk = thunkTypes(
  'auth/signUp',
  async (credentials: Sensitive<AuthCredentials>, { dispatch }): Promise<SignUpResult> => {
    const { email, password } = credentials.reveal()
    const result = await signUpWithPassword(email.trim(), password)
    if (!result.needsEmailConfirmation) {
      const user = await getCurrentAuthUser()
      if (user) dispatch(authSignedIn(user))
    }
    return result
  }
)

// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
export const resendSignUpEmailThunk = thunkTypes('auth/resendSignUp', async (email: string) => {
  await resendSignUpEmail(email.trim())
  return true
})

// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
export const sendPasswordResetThunk = thunkTypes(
  'auth/sendPasswordReset',
  async (email: string) => {
    await sendPasswordResetEmail(email.trim())
    return true
  }
)

// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
export const completePasswordRecoveryThunk = thunkTypes(
  'auth/completePasswordRecovery',
  async (newPassword: Sensitive<string>, { dispatch }) => {
    await updateAccountPassword(newPassword.reveal())
    dispatch(authPasswordRecoveryCompleted())
    return true
  }
)

export type SignOutResult = 'signedOut' | 'blocked' | 'exitedDemo'

/**
 * Sube lo pendiente, olvida la clave del hogar y cierra la sesión.
 * - En la demo solo sale de la demo: nunca cierra la sesión real ni borra nada de la nube.
 * - Si quedan cambios que no se pudieron subir no cierra: abre el diálogo "Tenés cambios
 *   sin guardar" y devuelve `blocked`. Con `force` los descarta.
 */
export const signOutThunk = thunkTypes(
  'auth/signOut',
  async (options: { force?: boolean } | void, { dispatch, getState }): Promise<SignOutResult> => {
    const vaultStatus = getState().vault.status
    if (vaultStatus === VaultStatus.DEMO) {
      await dispatch(exitDemoModeThunk())
      return 'exitedDemo'
    }
    if (!options?.force && vaultStatus === VaultStatus.UNLOCKED) {
      if (!(await flushPendingVaultSave())) {
        dispatch(setPendingExit(PendingExitReason.SIGN_OUT))
        return 'blocked'
      }
    }
    await dispatch(resetVaultThunk())
    try {
      await signOutFromCloud()
    } finally {
      dispatch(authSignedOut())
    }
    return 'signedOut'
  }
)

/** La sesión terminó con cambios sin guardar y el usuario eligió salir igual. */
const finishEndedSessionThunk = thunkTypes(
  'auth/finishEndedSession',
  async (_: void, { dispatch }) => {
    await dispatch(resetVaultThunk())
    let user = null
    try {
      user = await getCurrentAuthUser()
    } catch {
      user = null
    }
    dispatch(user ? authSignedIn(user) : authSignedOut())
  }
)

/**
 * Respuesta del diálogo "Tenés cambios sin guardar": `retry` vuelve a intentar guardar y
 * salir; `discard` sale descartando lo que no se subió. Devuelve `true` si salió.
 */
export const resolvePendingExitThunk = thunkTypes(
  'auth/resolvePendingExit',
  async (choice: 'retry' | 'discard', { dispatch, getState }): Promise<boolean> => {
    const reason = getState().ui.pendingExit
    const force = choice === 'discard'
    switch (reason) {
      case PendingExitReason.SIGN_OUT:
        return (await dispatch(signOutThunk({ force })).unwrap()) !== 'blocked'
      case PendingExitReason.LOCK:
        return (await dispatch(lockVaultThunk({ force })).unwrap()) !== 'blocked'
      case PendingExitReason.SESSION_ENDED:
        if (!force) return false
        await dispatch(finishEndedSessionThunk()).unwrap()
        return true
      case PendingExitReason.KEY_CHANGED:
        if (!force) return false
        await dispatch(closeAfterRemoteKeyChangeThunk()).unwrap()
        return true
      default:
        return true
    }
  }
)

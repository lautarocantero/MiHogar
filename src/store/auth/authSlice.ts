import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/apis/authApi'
import { AuthStatus } from './typings/enums'
import type { AuthState } from './typings/types'

const initialState: AuthState = {
  status: AuthStatus.INITIALIZING,
  user: null,
  hasLinkError: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authConfigMissing: (state) => {
      state.status = AuthStatus.CONFIG_ERROR
      state.user = null
    },
    authInitialized: (
      state,
      action: PayloadAction<{ user: AuthUser | null; isRecovery: boolean; hasLinkError: boolean }>
    ) => {
      const { user, isRecovery, hasLinkError } = action.payload
      state.user = user
      state.hasLinkError = hasLinkError
      if (!user) {
        state.status = AuthStatus.SIGNED_OUT
      } else if (isRecovery || state.status === AuthStatus.PASSWORD_RECOVERY) {
        // EMAILS DESACTIVADOS: inalcanzable por ahora (isRecovery llega siempre en false).
        state.status = AuthStatus.PASSWORD_RECOVERY
      } else {
        state.status = AuthStatus.SIGNED_IN
      }
    },
    authSignedIn: (state, action: PayloadAction<AuthUser>) => {
      const isSameUser = state.user?.id === action.payload.id
      state.user = action.payload
      // Mientras elige la contraseña nueva no se lo deja pasar a la app.
      if (state.status === AuthStatus.PASSWORD_RECOVERY && isSameUser) return
      if (state.status !== AuthStatus.INITIALIZING) {
        state.status = AuthStatus.SIGNED_IN
      }
    },
    // EMAILS DESACTIVADOS: sin uso hasta reactivar "olvidé mi contraseña".
    authPasswordRecoveryStarted: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      state.status = AuthStatus.PASSWORD_RECOVERY
    },
    authPasswordRecoveryCompleted: (state) => {
      if (state.user) state.status = AuthStatus.SIGNED_IN
    },
    authSignedOut: (state) => {
      if (state.status === AuthStatus.CONFIG_ERROR) return
      state.user = null
      state.status = AuthStatus.SIGNED_OUT
    },
    authLinkErrorDismissed: (state) => {
      state.hasLinkError = false
    }
  }
})

export const {
  authConfigMissing,
  authInitialized,
  authSignedIn,
  authPasswordRecoveryStarted,
  authPasswordRecoveryCompleted,
  authSignedOut,
  authLinkErrorDismissed
} = authSlice.actions

export const authReducer = authSlice.reducer

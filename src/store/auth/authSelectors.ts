import type { RootState } from '@/store'
import type { AuthStatus } from './typings/enums'

export const selectAuthStatus = (state: RootState): AuthStatus => state.auth.status

export const selectAuthEmail = (state: RootState): string | null => state.auth.user?.email ?? null

export const selectAuthHasLinkError = (state: RootState): boolean => state.auth.hasLinkError

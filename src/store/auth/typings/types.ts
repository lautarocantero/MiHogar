import type { AuthUser } from '@/apis/authApi'
import type { AuthStatus } from './enums'

export type AuthState = {
  status: AuthStatus
  user: AuthUser | null
  /** El link del email venció o es inválido. */
  hasLinkError: boolean
}

export type AuthCredentials = {
  email: string
  password: string
}

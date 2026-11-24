import { useAppSelector } from '@/store/hooks'
import { selectVaultStatus } from '@/store/vault/vaultSelectors'
import { VaultStatus } from '@/store/vault/typings/enums'
import { AuthStatus } from '@/store/auth/typings/enums'
import { useAuthGateStatus } from './useAuthGateStatus'
import { VaultCheckingSkeleton } from './components/VaultCheckingSkeleton'
import { AccountAccessPage } from './AccountAccessPage'
// EMAILS DESACTIVADOS: sin link de recuperación no se llega a elegir contraseña nueva.
// import { ResetPasswordPage } from './ResetPasswordPage'
import { CloudConfigErrorPage } from './CloudConfigErrorPage'
import type { AuthGateProps } from './typings/props'

/**
 * Primera puerta: la cuenta (Supabase). Adentro va `VaultGate` (la clave del hogar).
 * La demo no necesita cuenta ni toca la nube.
 */
export function AuthGate({ children }: AuthGateProps): React.JSX.Element {
  const status = useAuthGateStatus()
  const vaultStatus = useAppSelector(selectVaultStatus)

  if (vaultStatus === VaultStatus.DEMO) {
    return <>{children}</>
  }

  switch (status) {
    case AuthStatus.INITIALIZING:
      return <VaultCheckingSkeleton />
    case AuthStatus.CONFIG_ERROR:
      return <CloudConfigErrorPage />
    case AuthStatus.SIGNED_OUT:
      return <AccountAccessPage />
    // EMAILS DESACTIVADOS: reactivar junto con "olvidé mi contraseña".
    // case AuthStatus.PASSWORD_RECOVERY:
    //   return <ResetPasswordPage />
    default:
      return <>{children}</>
  }
}

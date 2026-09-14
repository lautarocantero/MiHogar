import { VaultStatus } from '@/store/vault/typings/enums'
import { useVaultGateStatus } from './useVaultGateStatus'
import { VaultCheckingSkeleton } from './components/VaultCheckingSkeleton'
import { FirstRunSetupPage } from './FirstRunSetupPage'
import { UnlockPage } from './UnlockPage'
import type { VaultGateProps } from './typings/props'

export function VaultGate({ children }: VaultGateProps): React.JSX.Element {
  const status = useVaultGateStatus()

  if (status === VaultStatus.CHECKING) {
    return <VaultCheckingSkeleton />
  }

  if (status === VaultStatus.NOT_CREATED) {
    return <FirstRunSetupPage />
  }

  if (status === VaultStatus.LOCKED) {
    return <UnlockPage />
  }

  return <>{children}</>
}

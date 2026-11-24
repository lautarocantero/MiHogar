import { VaultStatus } from '@/store/vault/typings/enums'
import { useT } from '@/i18n'
import { useVaultGateStatus } from './useVaultGateStatus'
import { VaultCheckingSkeleton } from './components/VaultCheckingSkeleton'
import { AuthPageLayout } from './components/AuthPageLayout'
import { StatusMessageCard } from './components/StatusMessageCard'
import { AccountFooter } from './components/AccountFooter'
import { FirstRunSetupPage } from './FirstRunSetupPage'
import { UnlockPage } from './UnlockPage'
import type { VaultGateProps } from './typings/props'

/** Segunda puerta (ya con cuenta): crear la clave del hogar o desbloquear el vault. */
export function VaultGate({ children }: VaultGateProps): React.JSX.Element {
  const t = useT()
  const { status, errorMessage, isChecking, retry } = useVaultGateStatus()

  if (status === VaultStatus.CHECKING) {
    // Se mantiene la tarjeta mientras reintenta, así no salta a un skeleton y vuelve.
    if (errorMessage) {
      return (
        <AuthPageLayout footer={<AccountFooter />}>
          <StatusMessageCard
            severity="error"
            title={t('cloudErrors.loadTitle')}
            description={errorMessage}
            actionLabel={t('common.retry')}
            onAction={retry}
            isActionLoading={isChecking}
          />
        </AuthPageLayout>
      )
    }
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

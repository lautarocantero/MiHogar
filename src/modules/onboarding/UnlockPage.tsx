import { useAppSelector } from '@/store/hooks'
import { selectVaultLockReason } from '@/store/vault/vaultSelectors'
import { VaultLockReason } from '@/store/vault/typings/enums'
import { useT } from '@/i18n'
import { AuthPageLayout } from './components/AuthPageLayout'
import { UnlockForm } from './components/UnlockForm'
import { AccountFooter } from './components/AccountFooter'
import { useUnlockVault } from './useUnlockVault'
import { useEnterDemoMode } from './useEnterDemoMode'

export function UnlockPage(): React.JSX.Element {
  const t = useT()
  const { submit, isSubmitting, errorMessage } = useUnlockVault()
  const { enterDemo, isEntering } = useEnterDemoMode()
  const lockReason = useAppSelector(selectVaultLockReason)

  return (
    <AuthPageLayout onDemoClick={enterDemo} isDemoLoading={isEntering} footer={<AccountFooter />}>
      <UnlockForm
        onSubmit={submit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        noticeMessage={
          lockReason === VaultLockReason.KEY_CHANGED ? t('sync.keyChangedElsewhere') : null
        }
      />
    </AuthPageLayout>
  )
}

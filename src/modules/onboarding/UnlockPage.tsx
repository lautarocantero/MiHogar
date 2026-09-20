import { AuthPageLayout } from './components/AuthPageLayout'
import { UnlockForm } from './components/UnlockForm'
import { useUnlockVault } from './useUnlockVault'
import { useEnterDemoMode } from './useEnterDemoMode'

export function UnlockPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useUnlockVault()
  const { enterDemo, isEntering } = useEnterDemoMode()

  return (
    <AuthPageLayout onDemoClick={enterDemo} isDemoLoading={isEntering}>
      <UnlockForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
    </AuthPageLayout>
  )
}

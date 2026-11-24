import { AuthPageLayout } from './components/AuthPageLayout'
import { CreateHouseholdKeyForm } from './components/CreateHouseholdKeyForm'
import { RestoreBackupSection } from './components/RestoreBackupSection'
import { AccountFooter } from './components/AccountFooter'
import { useCreateHousehold } from './useCreateHousehold'
import { useEnterDemoMode } from './useEnterDemoMode'

export function FirstRunSetupPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateHousehold()
  const { enterDemo, isEntering } = useEnterDemoMode()

  return (
    <AuthPageLayout onDemoClick={enterDemo} isDemoLoading={isEntering} footer={<AccountFooter />}>
      <CreateHouseholdKeyForm
        onSubmit={submit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
      <RestoreBackupSection />
    </AuthPageLayout>
  )
}

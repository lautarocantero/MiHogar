import { AuthPageLayout } from './components/AuthPageLayout'
import { CreateHouseholdKeyForm } from './components/CreateHouseholdKeyForm'
import { useCreateHousehold } from './useCreateHousehold'
import { useEnterDemoMode } from './useEnterDemoMode'

export function FirstRunSetupPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateHousehold()
  const { enterDemo, isEntering } = useEnterDemoMode()

  return (
    <AuthPageLayout onDemoClick={enterDemo} isDemoLoading={isEntering}>
      <CreateHouseholdKeyForm
        onSubmit={submit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </AuthPageLayout>
  )
}

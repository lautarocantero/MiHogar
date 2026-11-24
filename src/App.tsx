import { AuthGate } from '@/modules/onboarding/AuthGate'
import { VaultGate } from '@/modules/onboarding/VaultGate'
import { AppRouter } from '@/router/AppRouter'

export function App(): React.JSX.Element {
  return (
    <AuthGate>
      <VaultGate>
        <AppRouter />
      </VaultGate>
    </AuthGate>
  )
}

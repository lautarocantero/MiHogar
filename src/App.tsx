import { VaultGate } from '@/modules/onboarding/VaultGate'
import { AppRouter } from '@/router/AppRouter'

export function App(): React.JSX.Element {
  return (
    <VaultGate>
      <AppRouter />
    </VaultGate>
  )
}

import { useT } from '@/i18n'
import { AuthPageLayout } from './components/AuthPageLayout'
import { StatusMessageCard } from './components/StatusMessageCard'
import { useEnterDemoMode } from './useEnterDemoMode'

/** Faltan `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: no se puede usar la nube (la demo sí). */
export function CloudConfigErrorPage(): React.JSX.Element {
  const t = useT()
  const { enterDemo, isEntering } = useEnterDemoMode()

  return (
    <AuthPageLayout onDemoClick={enterDemo} isDemoLoading={isEntering}>
      <StatusMessageCard
        severity="error"
        title={t('cloudErrors.configTitle')}
        description={t('cloudErrors.configDescription')}
      />
    </AuthPageLayout>
  )
}

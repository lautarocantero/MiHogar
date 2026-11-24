import { useLocation, matchPath } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { useT } from '@/i18n'

const SCREEN_TITLES: Array<{ path: string; titleKey: string; parentPath?: string }> = [
  { path: ROUTES.HOME, titleKey: 'nav.home' },
  { path: ROUTES.CALENDAR, titleKey: 'nav.calendar' },
  {
    path: ROUTES.IMPORT_STATEMENTS,
    titleKey: 'importStatements.title',
    parentPath: ROUTES.PAYMENTS
  },
  { path: ROUTES.PAYMENT_DETAIL, titleKey: 'nav.paymentDetail', parentPath: ROUTES.PAYMENTS },
  { path: ROUTES.PAYMENTS, titleKey: 'nav.payments' },
  { path: ROUTES.ACCOUNTS, titleKey: 'nav.accounts' },
  { path: ROUTES.PROJECTION, titleKey: 'nav.projection' },
  { path: ROUTES.SAVINGS, titleKey: 'nav.savings' },
  { path: ROUTES.DEBTS, titleKey: 'nav.debts' },
  { path: ROUTES.REPORTS, titleKey: 'nav.reports' },
  { path: ROUTES.SETTINGS, titleKey: 'nav.settings' }
]

export type ScreenTitleInfo = {
  title: string
  parentPath: string | null
}

export function useScreenTitle(): ScreenTitleInfo {
  const t = useT()
  const location = useLocation()
  const match = SCREEN_TITLES.find((screen) => matchPath(screen.path, location.pathname))
  return {
    title: t(match?.titleKey ?? 'common.appName'),
    parentPath: match?.parentPath ?? null
  }
}

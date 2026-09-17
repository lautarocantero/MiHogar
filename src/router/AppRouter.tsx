import { Suspense, lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layout/AppLayout'
import { PageSkeleton } from './PageSkeleton'
import { ROUTES } from './routes'

const HomePage = lazy(() =>
  import('@/modules/home/HomePage').then((module) => ({ default: module.HomePage }))
)
const AccountsPage = lazy(() =>
  import('@/modules/accounts/AccountsPage').then((module) => ({ default: module.AccountsPage }))
)
const PaymentsListPage = lazy(() =>
  import('@/modules/payments/PaymentsListPage').then((module) => ({
    default: module.PaymentsListPage
  }))
)
const PaymentDetailPage = lazy(() =>
  import('@/modules/payments/PaymentDetailPage').then((module) => ({
    default: module.PaymentDetailPage
  }))
)
const CalendarPage = lazy(() =>
  import('@/modules/calendar/CalendarPage').then((module) => ({ default: module.CalendarPage }))
)
const ProjectionPage = lazy(() =>
  import('@/modules/projection/ProjectionPage').then((module) => ({
    default: module.ProjectionPage
  }))
)
const SavingsPage = lazy(() =>
  import('@/modules/savings/SavingsPage').then((module) => ({ default: module.SavingsPage }))
)
const ReportsPage = lazy(() =>
  import('@/modules/reports/ReportsPage').then((module) => ({ default: module.ReportsPage }))
)
const SettingsPage = lazy(() =>
  import('@/modules/settings/SettingsPage').then((module) => ({ default: module.SettingsPage }))
)
export function AppRouter(): React.JSX.Element {
  return (
    <HashRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
            <Route path={ROUTES.PAYMENTS} element={<PaymentsListPage />} />
            <Route path={ROUTES.PAYMENT_DETAIL} element={<PaymentDetailPage />} />
            <Route path={ROUTES.ACCOUNTS} element={<AccountsPage />} />
            <Route path={ROUTES.PROJECTION} element={<ProjectionPage />} />
            <Route path={ROUTES.SAVINGS} element={<SavingsPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

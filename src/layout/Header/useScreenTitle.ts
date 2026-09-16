import { useLocation, matchPath } from 'react-router-dom'
import { ROUTES } from '@/router/routes'

const SCREEN_TITLES: Array<{ path: string; title: string; parentPath?: string }> = [
  { path: ROUTES.HOME, title: 'Inicio' },
  { path: ROUTES.CALENDAR, title: 'Calendario de pagos' },
  { path: ROUTES.TIMELINE, title: 'Línea de tiempo' },
  { path: ROUTES.PAYMENT_DETAIL, title: 'Detalle del pago', parentPath: ROUTES.PAYMENTS },
  { path: ROUTES.PAYMENTS, title: 'Pagos y servicios' },
  { path: ROUTES.ACCOUNTS, title: 'Cuentas y tarjetas' },
  { path: ROUTES.PROJECTION, title: 'Proyección del mes' },
  { path: ROUTES.SAVINGS, title: 'Ahorros e inversiones' },
  { path: ROUTES.REPORTS, title: 'Informes' },
  { path: ROUTES.SETTINGS, title: 'Configuración' }
]

export type ScreenTitleInfo = {
  title: string
  parentPath: string | null
}

export function useScreenTitle(): ScreenTitleInfo {
  const location = useLocation()
  const match = SCREEN_TITLES.find((screen) => matchPath(screen.path, location.pathname))
  return {
    title: match?.title ?? 'Mi Hogar',
    parentPath: match?.parentPath ?? null
  }
}

import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SavingsIcon from '@mui/icons-material/Savings'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import BarChartIcon from '@mui/icons-material/BarChart'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import { ROUTES } from '@/router/routes'
import { IS_TASKS_ENABLED } from '@/utils/featureFlags'
import type { SidebarItem } from './typings/types'

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', path: ROUTES.HOME, icon: DashboardIcon },
  { label: 'Calendario de pagos', path: ROUTES.CALENDAR, icon: CalendarMonthIcon },
  { label: 'Pagos y servicios', path: ROUTES.PAYMENTS, icon: ReceiptLongIcon },
  { label: 'Cuentas y tarjetas', path: ROUTES.ACCOUNTS, icon: AccountBalanceIcon },
  { label: 'Proyección del mes', path: ROUTES.PROJECTION, icon: TrendingUpIcon },
  { label: 'Ahorros e inversiones', path: ROUTES.SAVINGS, icon: SavingsIcon },
  { label: 'Deudas y préstamos', path: ROUTES.DEBTS, icon: RequestQuoteIcon },
  { label: 'Informes', path: ROUTES.REPORTS, icon: BarChartIcon },
  ...(IS_TASKS_ENABLED
    ? [{ label: 'Tareas', path: ROUTES.TASKS, icon: ViewKanbanIcon }]
    : [])
]

export function useSidebarItems(): SidebarItem[] {
  return SIDEBAR_ITEMS
}

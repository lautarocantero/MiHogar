import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SavingsIcon from '@mui/icons-material/Savings'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import BarChartIcon from '@mui/icons-material/BarChart'
import { ROUTES } from '@/router/routes'
import { useMemo } from 'react'
import { useT } from '@/i18n'
import type { SidebarItem } from './typings/types'

const SIDEBAR_ITEMS: Array<Omit<SidebarItem, 'label'> & { labelKey: string }> = [
  { labelKey: 'nav.calendar', path: ROUTES.CALENDAR, icon: CalendarMonthIcon },
  { labelKey: 'nav.payments', path: ROUTES.PAYMENTS, icon: ReceiptLongIcon },
  { labelKey: 'nav.accounts', path: ROUTES.ACCOUNTS, icon: AccountBalanceIcon },
  { labelKey: 'nav.projection', path: ROUTES.PROJECTION, icon: TrendingUpIcon },
  { labelKey: 'nav.savings', path: ROUTES.SAVINGS, icon: SavingsIcon },
  { labelKey: 'nav.debts', path: ROUTES.DEBTS, icon: RequestQuoteIcon },
  { labelKey: 'nav.reports', path: ROUTES.REPORTS, icon: BarChartIcon }
]

export function useSidebarItems(): SidebarItem[] {
  const t = useT()
  return useMemo(
    () => SIDEBAR_ITEMS.map(({ labelKey, ...item }) => ({ ...item, label: t(labelKey) })),
    [t]
  )
}

import type { Account } from '@/typings/domain/types'
import type { HomeDebtItem, RecentMovementView, UpcomingPaymentView } from './types'

export type HeroBalanceCardProps = {
  totalAvailable: number
  accounts: Account[]
  pendingTotal: number
  pendingCount: number
  remainingAfterPayments: number
  debtsSlot?: React.ReactNode
}

export type UpcomingPaymentsListProps = {
  payments: UpcomingPaymentView[]
}

export type RecentMovementsListProps = {
  movements: RecentMovementView[]
}

export type HomeDebtsCardProps = {
  debts: HomeDebtItem[]
  totalDebt: number
}

import type { Account } from '@/typings/domain/types'
import type { RecentMovementView, UpcomingPaymentView } from './types'

export type HeroBalanceCardProps = {
  totalAvailable: number
  accounts: Account[]
  pendingTotal: number
  pendingCount: number
  remainingAfterPayments: number
}

export type UpcomingPaymentsListProps = {
  payments: UpcomingPaymentView[]
}

export type RecentMovementsListProps = {
  movements: RecentMovementView[]
}

import type { Account, Movement, Payment } from '@/typings/domain/types'

export type UpcomingPaymentView = {
  payment: Payment
  accountName: string
  displayDate: string
}

export type RecentMovementView = {
  movement: Movement
  accountName: string
}

export type HomeData = {
  totalAvailable: number
  accounts: Account[]
  pendingTotal: number
  pendingCount: number
  remainingAfterPayments: number
  upcomingPayments: UpcomingPaymentView[]
  recentMovements: RecentMovementView[]
}

import type { Account, Movement, Payment } from '@/typings/domain/types'

export type UpcomingPaymentView =
  | {
      kind: 'payment'
      payment: Payment
      accountName: string
      displayDate: string
    }
  | {
      kind: 'cardClosing'
      accountId: string
      accountName: string
      amount: number
      displayDate: string
      paymentCount: number
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

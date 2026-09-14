import type { Payment } from '@/typings/domain/types'

export function computePendingTotal(pendingPayments: Payment[]): number {
  return pendingPayments.reduce((total, payment) => total + payment.amount, 0)
}

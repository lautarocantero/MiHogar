import type { Payment } from '@/typings/domain/types'

export function computeInstallmentsRemaining(
  payment: Pick<Payment, 'installmentsTotal' | 'installmentsPaid'>
): number | undefined {
  if (typeof payment.installmentsTotal !== 'number') return undefined
  return Math.max(payment.installmentsTotal - (payment.installmentsPaid ?? 0), 0)
}

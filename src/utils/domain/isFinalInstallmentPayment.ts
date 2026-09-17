import { PaymentStatus } from '@/typings/domain/enums'
import type { Payment } from '@/typings/domain/types'
import { computeInstallmentsRemaining } from './computeInstallmentsRemaining'

export function isFinalInstallmentPayment(payment: Payment): boolean {
  return computeInstallmentsRemaining(payment) === 1 && payment.status === PaymentStatus.PENDING
}

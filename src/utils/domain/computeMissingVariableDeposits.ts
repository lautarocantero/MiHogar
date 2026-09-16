import { isBefore, parseISO } from 'date-fns'
import type { Payment } from '@/typings/domain/types'
import { AmountMode, PaymentKind, PaymentStatus } from '@/typings/domain/enums'

export function computeMissingVariableDeposits(
  payments: Payment[],
  referenceDate: Date = new Date()
): Payment[] {
  return payments.filter(
    (payment) =>
      payment.kind === PaymentKind.DEPOSIT &&
      payment.amountMode === AmountMode.VARIABLE &&
      payment.status === PaymentStatus.PENDING &&
      isBefore(parseISO(payment.dueDate), referenceDate)
  )
}

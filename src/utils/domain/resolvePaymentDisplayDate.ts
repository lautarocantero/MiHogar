import type { Account, Payment } from '@/typings/domain/types'
import { AccountType } from '@/typings/domain/enums'
import { computeNextClosingDate } from './computeNextClosingDate'

export function resolvePaymentDisplayDate(
  payment: Payment,
  account: Account | undefined,
  referenceDate: Date = new Date()
): string {
  if (account?.type === AccountType.CREDIT_CARD && account.closingDay) {
    return computeNextClosingDate(account.closingDay, referenceDate)
  }
  return payment.dueDate
}

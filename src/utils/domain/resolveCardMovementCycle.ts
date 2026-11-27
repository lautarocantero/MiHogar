import { format, parseISO, startOfDay } from 'date-fns'
import { AccountType, Currency, MovementType, PaymentStatus } from '@/typings/domain/enums'
import type { Account, Movement } from '@/typings/domain/types'
import { computeNextClosingDate } from './computeNextClosingDate'

export interface CardMovementCycle {
  displayDate: string
  status: PaymentStatus
  remaining: number
}

/**
 * Card purchases are owed on the closing date of their cycle. Unpaid purchases whose closing
 * already passed roll over to the next closing; they stay pending until card payments cover them.
 */
export function resolveCardMovementCycle(
  movement: Movement,
  account: Account | undefined,
  remainingById: Map<string, number>,
  referenceDate: Date = new Date()
): CardMovementCycle | null {
  if (account?.type !== AccountType.CREDIT_CARD || !account.closingDay) return null
  if (movement.type !== MovementType.EXPENSE) return null
  if ((movement.currency ?? Currency.ARS) !== Currency.ARS) return null

  const remaining = remainingById.get(movement.id) ?? movement.amount
  const ownClosingIso = computeNextClosingDate(account.closingDay, parseISO(movement.date))

  if (remaining <= 0) {
    return { displayDate: ownClosingIso, status: PaymentStatus.PAID, remaining: 0 }
  }

  const today = startOfDay(referenceDate)
  const todayIso = format(today, 'yyyy-MM-dd')
  const displayDate =
    ownClosingIso >= todayIso ? ownClosingIso : computeNextClosingDate(account.closingDay, today)
  return { displayDate, status: PaymentStatus.PENDING, remaining }
}

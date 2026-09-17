import { AccountType } from '@/typings/domain/enums'
import type { Account } from '@/typings/domain/types'

function hasCurrentCycleDuePassed(dueDay: number, today: Date): boolean {
  const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const effectiveDueDay = Math.min(dueDay, daysInCurrentMonth)
  return today.getDate() > effectiveDueDay
}

export function rolloverCreditCardCycle(account: Account, today: Date): Account | null {
  if (account.type !== AccountType.CREDIT_CARD || !account.dueDay) return null
  if (account.nextClosingDay == null && account.nextDueDay == null) return null
  if (!hasCurrentCycleDuePassed(account.dueDay, today)) return null

  return {
    ...account,
    closingDay: account.nextClosingDay ?? account.closingDay,
    dueDay: account.nextDueDay ?? account.dueDay,
    nextClosingDay: undefined,
    nextDueDay: undefined
  }
}

export function reconcileAccountsForRollover(accounts: Account[], today: Date): Account[] {
  return accounts
    .map((account) => rolloverCreditCardCycle(account, today))
    .filter((account): account is Account => account !== null)
}

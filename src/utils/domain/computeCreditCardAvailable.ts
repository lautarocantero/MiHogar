import type { Account } from '@/typings/domain/types'
import { AccountType } from '@/typings/domain/enums'

export function computeSingleCardAvailable(account: Account): number {
  return Math.max((account.creditLimit ?? 0) - (account.usedAmount ?? 0), 0)
}

export function computeCreditCardAvailable(accounts: Account[]): number {
  return accounts
    .filter((account) => account.type === AccountType.CREDIT_CARD)
    .reduce((total, account) => total + computeSingleCardAvailable(account), 0)
}

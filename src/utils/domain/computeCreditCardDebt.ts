import type { Account } from '@/typings/domain/types'
import { AccountType } from '@/typings/domain/enums'

export function computeCreditCardDebt(accounts: Account[]): number {
  return accounts
    .filter((account) => account.type === AccountType.CREDIT_CARD && account.balance < 0)
    .reduce((total, account) => total + Math.abs(account.balance), 0)
}

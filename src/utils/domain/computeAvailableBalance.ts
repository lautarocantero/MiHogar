import type { Account } from '@/typings/domain/types'
import { AccountType } from '@/typings/domain/enums'

export function computeAvailableBalance(accounts: Account[]): number {
  return accounts
    .filter((account) => account.type !== AccountType.CREDIT_CARD)
    .reduce((total, account) => total + account.balance, 0)
}

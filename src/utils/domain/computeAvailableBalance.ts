import type { Account } from '@/typings/domain/types'

export function computeAvailableBalance(accounts: Account[]): number {
  return accounts.reduce((total, account) => total + account.balance, 0)
}

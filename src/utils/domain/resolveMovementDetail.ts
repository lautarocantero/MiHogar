import type { Account, Movement } from '@/typings/domain/types'
import { MovementType } from '@/typings/domain/enums'

export function resolveMovementDetail(movement: Movement, accounts: Account[]): string {
  const accountsById = new Map(accounts.map((account) => [account.id, account]))
  const accountName = accountsById.get(movement.accountId)?.name ?? 'una cuenta'

  if (movement.type === MovementType.INCOME) {
    return `Acreditado en ${accountName}`
  }
  if (movement.type === MovementType.TRANSFER) {
    const toAccountName = movement.toAccountId
      ? (accountsById.get(movement.toAccountId)?.name ?? 'otra cuenta')
      : 'otra cuenta'
    return `De ${accountName} a ${toAccountName}`
  }
  if (movement.paymentId) {
    return 'Débito automático'
  }
  return `Débito de ${accountName}`
}

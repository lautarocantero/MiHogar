import { t } from '@/i18n'
import type { Account, Movement } from '@/typings/domain/types'
import { MovementType } from '@/typings/domain/enums'

export function resolveMovementDetail(movement: Movement, accounts: Account[]): string {
  const accountsById = new Map(accounts.map((account) => [account.id, account]))
  const accountName = accountsById.get(movement.accountId)?.name ?? t('format.movement.anAccount')

  if (movement.type === MovementType.INCOME) {
    return t('format.movement.creditedTo', { account: accountName })
  }
  if (movement.type === MovementType.TRANSFER) {
    const toAccountName = movement.toAccountId
      ? (accountsById.get(movement.toAccountId)?.name ?? t('format.movement.otherAccount'))
      : t('format.movement.otherAccount')
    return t('format.movement.transfer', { from: accountName, to: toAccountName })
  }
  if (movement.paymentId) {
    return t('format.movement.autoDebit')
  }
  return t('format.movement.debitFrom', { account: accountName })
}

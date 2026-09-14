import { AccountType } from '@/typings/domain/enums'

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.BANK]: 'Cuenta bancaria',
  [AccountType.CASH]: 'Efectivo',
  [AccountType.CREDIT_CARD]: 'Tarjeta de crédito'
}

export function resolveAccountTypeLabel(type: AccountType): string {
  return ACCOUNT_TYPE_LABELS[type]
}

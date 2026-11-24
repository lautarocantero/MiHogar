import { t } from '@/i18n'
import type { AccountType } from '@/typings/domain/enums'

export function resolveAccountTypeLabel(type: AccountType): string {
  return t(`format.accountType.${type}`)
}

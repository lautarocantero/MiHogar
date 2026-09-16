import { AccountType } from '@/typings/domain/enums'
import { organicColors } from '@/theme/tokens'

type AccountTypeColor = { main: string; dark: string; tint: string }

const ACCOUNT_TYPE_COLORS: Record<AccountType, AccountTypeColor> = {
  [AccountType.BANK]: organicColors.brown,
  [AccountType.CASH]: organicColors.sage,
  [AccountType.CREDIT_CARD]: organicColors.blue
}

export function resolveAccountTypeColor(type: AccountType): AccountTypeColor {
  return ACCOUNT_TYPE_COLORS[type]
}

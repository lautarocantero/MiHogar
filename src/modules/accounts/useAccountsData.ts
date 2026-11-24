import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts, selectTotalAvailableBalance } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { computeCreditCardAvailable } from '@/utils/domain/computeCreditCardAvailable'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolveAccountTypeLabel } from '@/utils/domain/resolveAccountTypeLabel'
import { useI18n } from '@/i18n'
import type { AccountsData } from './typings/types'

export function useAccountsData(): AccountsData {
  const accounts = useAppSelector(selectAllAccounts)
  const totalAvailable = useAppSelector(selectTotalAvailableBalance)
  const members = useAppSelector(selectAllMembers)
  // Las etiquetas (dueño, tipo) se traducen con el idioma activo: se recalculan al cambiarlo.
  const { locale } = useI18n()

  return useMemo(() => {
    const accountViews = accounts
      .map((account, index) => ({
        ...account,
        ownerLabel: resolveOwnerLabel(account.ownerType, account.ownerId, members),
        typeLabel: resolveAccountTypeLabel(account.type),
        sourceAccountName: account.sourceAccountId
          ? accounts.find((candidate) => candidate.id === account.sourceAccountId)?.name
          : undefined,
        sortOrder: account.sortOrder ?? index
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder)

    return {
      totalAvailable,
      totalCreditAvailable: computeCreditCardAvailable(accounts),
      accountViews
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, totalAvailable, members, locale])
}

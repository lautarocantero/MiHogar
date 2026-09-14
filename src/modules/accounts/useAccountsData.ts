import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts, selectTotalAvailableBalance } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { computeCreditCardDebt } from '@/utils/domain/computeCreditCardDebt'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolveAccountTypeLabel } from '@/utils/domain/resolveAccountTypeLabel'
import type { AccountsData } from './typings/types'

export function useAccountsData(): AccountsData {
  const accounts = useAppSelector(selectAllAccounts)
  const totalAvailable = useAppSelector(selectTotalAvailableBalance)
  const members = useAppSelector(selectAllMembers)

  return useMemo(() => {
    const accountViews = accounts.map((account) => ({
      ...account,
      ownerLabel: resolveOwnerLabel(account.ownerType, account.ownerId, members),
      typeLabel: resolveAccountTypeLabel(account.type)
    }))

    return {
      totalAvailable,
      creditCardDebt: computeCreditCardDebt(accounts),
      accountViews
    }
  }, [accounts, totalAvailable, members])
}

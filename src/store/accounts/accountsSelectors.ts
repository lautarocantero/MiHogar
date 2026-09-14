import type { RootState } from '@/store'
import type { Account } from '@/typings/domain/types'
import { computeAvailableBalance } from '@/utils/domain/computeAvailableBalance'
import { accountsSelectors } from './accountsSlice'

export const selectAllAccounts = (state: RootState): Account[] =>
  accountsSelectors.selectAll(state.accounts)

export const selectAccountById = (state: RootState, accountId: string): Account | undefined =>
  accountsSelectors.selectById(state.accounts, accountId)

export const selectTotalAvailableBalance = (state: RootState): number =>
  computeAvailableBalance(accountsSelectors.selectAll(state.accounts))

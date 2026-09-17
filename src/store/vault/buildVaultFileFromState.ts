import type { RootState } from '@/store'
import type { VaultFile } from '@/typings/domain/types'
import { accountsSelectors } from '@/store/accounts/accountsSlice'
import { paymentsSelectors } from '@/store/payments/paymentsSlice'
import { movementsSelectors } from '@/store/movements/movementsSlice'
import { savingsSelectors } from '@/store/savings/savingsSlice'
import { categoriesSelectors } from '@/store/categories/categoriesSlice'
import { membersSelectors } from '@/store/household/membersSlice'
import { notificationsSelectors } from '@/store/notifications/notificationsSlice'

export function buildVaultFileFromState(state: RootState): VaultFile {
  return {
    version: 1,
    household: state.household,
    members: membersSelectors.selectAll(state.members),
    accounts: accountsSelectors.selectAll(state.accounts),
    payments: paymentsSelectors.selectAll(state.payments),
    movements: movementsSelectors.selectAll(state.movements),
    savingsInstruments: savingsSelectors.selectAll(state.savings),
    categories: categoriesSelectors.selectAll(state.categories),
    notifications: notificationsSelectors.selectAll(state.notifications)
  }
}

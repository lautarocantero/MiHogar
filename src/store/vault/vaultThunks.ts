import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/store'
import {
  vaultExists,
  createVaultFile,
  unlockVaultFile,
  lockVaultFile,
  saveVaultFile,
  changeHouseholdKey as changeHouseholdKeyApi,
  exportVaultBackup as exportVaultBackupApi,
  importVaultBackup as importVaultBackupApi
} from '@/apis/vaultApi'
import { vaultFileSchema } from '@/validation/vaultFileSchema'
import type { VaultFile } from '@/typings/domain/types'
import type { ChangeHouseholdKeyInput } from './typings/types'
import { hydrateHousehold } from '@/store/household/householdSlice'
import { hydrateMembers } from '@/store/household/membersSlice'
import { hydrateAccounts, updateAccount } from '@/store/accounts/accountsSlice'
import { reconcileAccountsForRollover } from '@/utils/domain/rolloverCreditCardCycle'
import { hydratePayments } from '@/store/payments/paymentsSlice'
import { hydrateMovements } from '@/store/movements/movementsSlice'
import { hydrateSavings } from '@/store/savings/savingsSlice'
import { hydrateCategories } from '@/store/categories/categoriesSlice'
import { hydrateReadNotifications } from '@/store/notifications/notificationsSlice'
import { buildDefaultCategories } from '@/utils/domain/buildDefaultCategories'
import { buildVaultFileFromState } from './buildVaultFileFromState'
import { buildDemoVaultFile } from './demoVaultData'

const thunkTypes = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()

function hydrateDomainSlices(dispatch: AppDispatch, vaultFile: VaultFile): void {
  dispatch(hydrateHousehold(vaultFile.household))
  dispatch(hydrateMembers(vaultFile.members))
  dispatch(hydrateAccounts(vaultFile.accounts))
  reconcileAccountsForRollover(vaultFile.accounts, new Date()).forEach((account) =>
    dispatch(updateAccount(account))
  )
  dispatch(hydratePayments(vaultFile.payments))
  dispatch(hydrateMovements(vaultFile.movements))
  dispatch(hydrateSavings(vaultFile.savingsInstruments))
  dispatch(hydrateCategories(vaultFile.categories))
  dispatch(hydrateReadNotifications(vaultFile.notifications))
}

export const checkVaultExistsThunk = thunkTypes('vault/checkExists', async () => {
  return vaultExists()
})

export const createVaultThunk = thunkTypes(
  'vault/create',
  async (householdKey: string, { dispatch }) => {
    const rawVaultFile = await createVaultFile(householdKey)
    const vaultFile = vaultFileSchema.parse(rawVaultFile)
    const seededVaultFile: VaultFile = { ...vaultFile, categories: buildDefaultCategories() }
    hydrateDomainSlices(dispatch, seededVaultFile)
    await dispatch(saveVaultThunk()).unwrap()
  }
)

export const unlockVaultThunk = thunkTypes(
  'vault/unlock',
  async (householdKey: string, { dispatch }) => {
    const rawVaultFile = await unlockVaultFile(householdKey)
    const vaultFile = vaultFileSchema.parse(rawVaultFile)
    hydrateDomainSlices(dispatch, vaultFile)
  }
)

export const enterDemoModeThunk = thunkTypes('vault/enterDemo', async (_: void, { dispatch }) => {
  const demoVaultFile = vaultFileSchema.parse(buildDemoVaultFile())
  hydrateDomainSlices(dispatch, demoVaultFile)
})

export const exitDemoModeThunk = thunkTypes('vault/exitDemo', async (_: void, { dispatch }) => {
  await dispatch(checkVaultExistsThunk()).unwrap()
})

export const lockVaultThunk = thunkTypes('vault/lock', async () => {
  await lockVaultFile()
})

export const saveVaultThunk = thunkTypes('vault/save', async (_: void, { getState }) => {
  const vaultFile = buildVaultFileFromState(getState())
  const validatedVaultFile = vaultFileSchema.parse(vaultFile)
  await saveVaultFile(validatedVaultFile)
})

export const changeHouseholdKeyThunk = thunkTypes(
  'vault/changeKey',
  async ({ currentKey, newKey }: ChangeHouseholdKeyInput) => {
    await changeHouseholdKeyApi(currentKey, newKey)
    return true
  }
)

export const exportVaultBackupThunk = thunkTypes('vault/exportBackup', async () => {
  return exportVaultBackupApi()
})

export const importVaultBackupThunk = thunkTypes('vault/importBackup', async () => {
  return importVaultBackupApi()
})

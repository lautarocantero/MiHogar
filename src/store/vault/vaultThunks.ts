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
import { hydrateAccounts } from '@/store/accounts/accountsSlice'
import { hydratePayments } from '@/store/payments/paymentsSlice'
import { hydrateMovements } from '@/store/movements/movementsSlice'
import { hydrateSavings } from '@/store/savings/savingsSlice'
import { hydrateCategories } from '@/store/categories/categoriesSlice'
import { buildDefaultCategories } from '@/utils/domain/buildDefaultCategories'
import { buildVaultFileFromState } from './buildVaultFileFromState'

const thunkTypes = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()

function hydrateDomainSlices(dispatch: AppDispatch, vaultFile: VaultFile): void {
  dispatch(hydrateHousehold(vaultFile.household))
  dispatch(hydrateMembers(vaultFile.members))
  dispatch(hydrateAccounts(vaultFile.accounts))
  dispatch(hydratePayments(vaultFile.payments))
  dispatch(hydrateMovements(vaultFile.movements))
  dispatch(hydrateSavings(vaultFile.savingsInstruments))
  dispatch(hydrateCategories(vaultFile.categories))
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

import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/store'
import {
  vaultExists,
  createVaultFile,
  unlockVaultFile,
  lockVaultFile,
  changeHouseholdKey as changeHouseholdKeyApi,
  exportVaultBackup as exportVaultBackupApi,
  openVaultBackup,
  uploadVaultBackup,
  downloadRemoteVault,
  commitKnownVaultVersion
} from '@/apis/vaultApi'
import { AppError, InvalidHouseholdKeyError, VaultConflictError } from '@/apis/cloud/errors'
import { t } from '@/i18n'
import { vaultFileSchema } from '@/validation/vaultFileSchema'
import type { VaultFile } from '@/typings/domain/types'
import type { Sensitive } from '@/utils/sensitive'
import type {
  ChangeHouseholdKeyInput,
  ReloadRemoteVaultReason,
  RestoreVaultInput
} from './typings/types'
import { VaultStatus } from './typings/enums'
import { AuthStatus } from '@/store/auth/typings/enums'
import { hydrateHousehold } from '@/store/household/householdSlice'
import { hydrateMembers } from '@/store/household/membersSlice'
import { hydrateAccounts, updateAccount } from '@/store/accounts/accountsSlice'
import { reconcileAccountsForRollover } from '@/utils/domain/rolloverCreditCardCycle'
import { hydratePayments } from '@/store/payments/paymentsSlice'
import { hydrateMovements } from '@/store/movements/movementsSlice'
import { hydrateSavings } from '@/store/savings/savingsSlice'
import { hydrateCategories } from '@/store/categories/categoriesSlice'
import { hydrateCategoryRules } from '@/store/categoryRules/categoryRulesSlice'
import { hydrateReadNotifications } from '@/store/notifications/notificationsSlice'
import { hydrateDebts } from '@/store/debts/debtsSlice'
import { hydrateSavingsGoals } from '@/store/savingsGoals/savingsGoalsSlice'
import { hydrateSavingsSnapshots } from '@/store/savingsSnapshots/savingsSnapshotsSlice'
import { setPendingExit, setSaveStatus, showToast } from '@/store/ui/uiSlice'
import { PendingExitReason, SaveStatus } from '@/store/ui/typings/enums'
import {
  discardPendingVaultSave,
  flushPendingVaultSave,
  getPendingVaultConflict,
  hasPendingVaultSave,
  keepLocalChangesOverConflict
} from '@/store/middleware/vaultSaveControl'
import { buildDefaultCategories } from '@/utils/domain/buildDefaultCategories'
import { buildVaultFileFromState } from './buildVaultFileFromState'
import { buildDemoVaultFile } from './demoVaultData'
import { parseVaultFile } from './parseVaultFile'

const thunkTypes = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()

function buildEmptyVaultFile(): VaultFile {
  return vaultFileSchema.parse({
    version: 1,
    household: { name: '' },
    members: [],
    accounts: [],
    payments: [],
    movements: [],
    savingsInstruments: [],
    categories: []
  })
}

/**
 * El contenido actual del store, validado, listo para cifrar. Se valida lo que va a
 * quedar DESPUÉS de serializar: un `Infinity` o `NaN` se vuelve `null` en JSON y dejaría
 * un vault que no se puede volver a abrir, así que se rechaza antes de subir nada.
 */
export function buildValidatedVaultFile(state: RootState): VaultFile {
  const serialized: unknown = JSON.parse(JSON.stringify(buildVaultFileFromState(state)))
  const result = vaultFileSchema.safeParse(serialized)
  if (!result.success) {
    throw new AppError('vaultErrors.invalidData', { cause: result.error })
  }
  return result.data
}

/** Avisa si al abrir hubo que corregir números dañados. */
function notifyIfRepaired(dispatch: AppDispatch, repaired: boolean): void {
  if (repaired) dispatch(showToast(t('sync.vaultRepaired')))
}

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
  dispatch(hydrateCategoryRules(vaultFile.categoryRules))
  dispatch(hydrateReadNotifications(vaultFile.notifications))
  dispatch(hydrateDebts(vaultFile.debts))
  dispatch(hydrateSavingsGoals(vaultFile.savingsGoals))
  dispatch(hydrateSavingsSnapshots(vaultFile.savingsSnapshots))
}

/** Borra los datos del hogar de la memoria (al bloquear / cerrar sesión). */
function clearDomainSlices(dispatch: AppDispatch): void {
  hydrateDomainSlices(dispatch, buildEmptyVaultFile())
}

function closeVaultSession(dispatch: AppDispatch): void {
  discardPendingVaultSave()
  void lockVaultFile()
  clearDomainSlices(dispatch)
  dispatch(setSaveStatus(SaveStatus.IDLE))
  dispatch(setPendingExit(null))
}

// Evita que un doble click cree el vault dos veces (el segundo insert fallaría con
// "ya existe" aunque el primero haya salido bien).
let isCreatingVault = false

export const checkVaultExistsThunk = thunkTypes('vault/checkExists', async () => {
  return vaultExists()
})

/*
 * Los thunks que reciben la clave del hogar la reciben envuelta en `Sensitive`, para que
 * no quede legible en `action.meta.arg` (DevTools, logs).
 */
export const createVaultThunk = thunkTypes(
  'vault/create',
  async (householdKey: Sensitive<string>, { dispatch }) => {
    isCreatingVault = true
    try {
      const seededVaultFile = vaultFileSchema.parse({
        ...buildEmptyVaultFile(),
        categories: buildDefaultCategories()
      })
      await createVaultFile(householdKey.reveal(), seededVaultFile)
      hydrateDomainSlices(dispatch, seededVaultFile)
    } finally {
      isCreatingVault = false
    }
  },
  { condition: () => !isCreatingVault }
)

export const unlockVaultThunk = thunkTypes(
  'vault/unlock',
  async (householdKey: Sensitive<string>, { dispatch }) => {
    const rawVaultFile = await unlockVaultFile(householdKey.reveal())
    try {
      const { vaultFile, repaired } = parseVaultFile(rawVaultFile)
      hydrateDomainSlices(dispatch, vaultFile)
      notifyIfRepaired(dispatch, repaired)
    } catch (error) {
      await lockVaultFile()
      throw error
    }
  }
)

/**
 * Importa un respaldo `.dat` (primer uso o reemplazo desde Configuración). Orden:
 * descifrar → validar → (recién ahí) subir → rehidratar. Si algo falla antes de que la
 * subida salga bien, la nube y la sesión actual quedan como estaban.
 */
export const restoreVaultThunk = thunkTypes(
  'vault/restore',
  async (input: Sensitive<RestoreVaultInput>, { dispatch, getState }) => {
    const { envelope, householdKey, replace } = input.reveal()
    const opened = await openVaultBackup(envelope, householdKey)
    const { vaultFile, repaired } = parseVaultFile(opened.vaultJson)
    if (getState().vault.status === VaultStatus.UNLOCKED) {
      // Que no quede un guardado en vuelo que pise el respaldo con la versión vieja.
      await flushPendingVaultSave()
    }
    await uploadVaultBackup(opened, vaultFile, { replace })
    discardPendingVaultSave()
    hydrateDomainSlices(dispatch, vaultFile)
    dispatch(setSaveStatus(SaveStatus.SAVED))
    dispatch(setPendingExit(null))
    notifyIfRepaired(dispatch, repaired)
  }
)

export const enterDemoModeThunk = thunkTypes('vault/enterDemo', async (_: void, { dispatch }) => {
  const demoVaultFile = vaultFileSchema.parse(buildDemoVaultFile())
  hydrateDomainSlices(dispatch, demoVaultFile)
})

/**
 * Sale de la demo. Devuelve si la cuenta tiene vault (`true`/`false`) o `null` si no
 * hay sesión iniciada o no se pudo consultar (el gate vuelve a chequear).
 */
export const exitDemoModeThunk = thunkTypes(
  'vault/exitDemo',
  async (_: void, { dispatch, getState }): Promise<boolean | null> => {
    clearDomainSlices(dispatch)
    if (getState().auth.status !== AuthStatus.SIGNED_IN) return null
    try {
      return await vaultExists()
    } catch {
      return null
    }
  }
)

/**
 * Bloquea el vault. Si quedan cambios que no se pudieron subir no bloquea: abre el
 * diálogo "Tenés cambios sin guardar" y devuelve `blocked`. Con `force` los descarta.
 */
export const lockVaultThunk = thunkTypes(
  'vault/lock',
  async (options: { force?: boolean } | void, { dispatch }): Promise<'locked' | 'blocked'> => {
    if (!options?.force && !(await flushPendingVaultSave())) {
      dispatch(setPendingExit(PendingExitReason.LOCK))
      return 'blocked'
    }
    closeVaultSession(dispatch)
    return 'locked'
  }
)

/** Cierra el vault sin guardar (sesión vencida, otro usuario): el gate vuelve a chequear. */
export const resetVaultThunk = thunkTypes('vault/reset', async (_: void, { dispatch }) => {
  closeVaultSession(dispatch)
})

/** La clave del hogar cambió en otro dispositivo y el usuario eligió descartar lo local. */
export const closeAfterRemoteKeyChangeThunk = thunkTypes(
  'vault/closeAfterKeyChange',
  async (_: void, { dispatch }) => {
    closeVaultSession(dispatch)
  }
)

/**
 * Trae el vault remoto (otro dispositivo guardó) y rehidrata. Nunca pisa cambios
 * locales: se vuelve a mirar si hay pendientes justo antes de rehidratar (el usuario
 * pudo editar mientras se descargaba). Devuelve:
 * - `reloaded`: se cargaron los cambios remotos.
 * - `skipped`: hay cambios locales sin subir, no se pisan.
 * - `locked`: la clave del hogar cambió en otro dispositivo; hay que ingresarla de nuevo.
 */
export const reloadRemoteVaultThunk = thunkTypes(
  'vault/reloadRemote',
  async (
    reason: ReloadRemoteVaultReason,
    { dispatch }
  ): Promise<'reloaded' | 'skipped' | 'locked'> => {
    let remote: Awaited<ReturnType<typeof downloadRemoteVault>>
    try {
      remote = await downloadRemoteVault()
    } catch (error) {
      if (error instanceof InvalidHouseholdKeyError) {
        if (hasPendingVaultSave()) {
          // Hay cambios sin subir: antes de cerrar se ofrece descargarlos.
          dispatch(setPendingExit(PendingExitReason.KEY_CHANGED))
          return 'skipped'
        }
        closeVaultSession(dispatch)
        return 'locked'
      }
      throw error
    }
    const { vaultFile, repaired } = parseVaultFile(remote.vaultJson)
    // Desde acá hasta rehidratar no hay `await`: nada puede colarse entre el chequeo y
    // la rehidratación.
    if (hasPendingVaultSave() || getPendingVaultConflict()) {
      return 'skipped'
    }
    discardPendingVaultSave()
    commitKnownVaultVersion(remote.version)
    hydrateDomainSlices(dispatch, vaultFile)
    dispatch(setSaveStatus(SaveStatus.SAVED))
    dispatch(
      showToast(t(reason === 'conflict' ? 'sync.conflictReloaded' : 'sync.remoteChangesLoaded'))
    )
    notifyIfRepaired(dispatch, repaired)
    return 'reloaded'
  }
)

/**
 * Conflicto: "Quedarme con mis cambios". Sube el estado local encima de la versión
 * remota. Si otro dispositivo volvió a guardar en el medio, el diálogo vuelve a abrirse.
 */
export const keepLocalChangesThunk = thunkTypes('vault/keepLocalChanges', async () => {
  return keepLocalChangesOverConflict()
})

/** Conflicto: "Usar los del otro dispositivo". Carga la versión remota que chocó. */
export const applyRemoteChangesThunk = thunkTypes(
  'vault/useRemoteChanges',
  async (_: void, { dispatch }) => {
    const conflict = getPendingVaultConflict()
    if (!conflict) return
    discardPendingVaultSave()
    commitKnownVaultVersion(conflict.version)
    hydrateDomainSlices(dispatch, conflict.vaultFile)
    dispatch(setSaveStatus(SaveStatus.SAVED))
    dispatch(showToast(t('sync.remoteChangesLoaded')))
  }
)

export const changeHouseholdKeyThunk = thunkTypes(
  'vault/changeKey',
  async (input: Sensitive<ChangeHouseholdKeyInput>, { dispatch, getState }) => {
    const { currentKey, newKey } = input.reveal()
    await flushPendingVaultSave()
    try {
      await changeHouseholdKeyApi(currentKey, newKey, buildValidatedVaultFile(getState()))
    } catch (error) {
      if (error instanceof VaultConflictError) {
        await dispatch(reloadRemoteVaultThunk('conflict'))
      }
      throw error
    }
    return true
  }
)

/** Descarga `gastito-respaldo.dat` con el contenido actual. Devuelve el nombre del archivo. */
export const exportVaultBackupThunk = thunkTypes(
  'vault/exportBackup',
  async (_: void, { getState }) => {
    await flushPendingVaultSave()
    return exportVaultBackupApi(buildValidatedVaultFile(getState()))
  }
)

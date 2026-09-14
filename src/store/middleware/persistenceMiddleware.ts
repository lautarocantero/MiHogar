import type { Middleware } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/store'
import { VaultStatus } from '@/store/vault/typings/enums'
import { saveVaultThunk } from '@/store/vault/vaultThunks'
import { setSaveStatus, setErrorMessage } from '@/store/ui/uiSlice'
import { SaveStatus } from '@/store/ui/typings/enums'

const MUTATING_ACTION_PREFIXES = [
  'household/',
  'members/',
  'accounts/',
  'payments/',
  'movements/',
  'savings/',
  'categories/'
]

const HYDRATE_ACTION_SUFFIX = /^hydrate/

function isMutatingAction(actionType: string): boolean {
  const [, actionName] = actionType.split('/')
  if (!actionName || HYDRATE_ACTION_SUFFIX.test(actionName)) {
    return false
  }
  return MUTATING_ACTION_PREFIXES.some((prefix) => actionType.startsWith(prefix))
}

export const persistenceMiddleware: Middleware<object, RootState, AppDispatch> =
  (storeApi) => (next) => (action) => {
    const result = next(action)

    const actionType =
      typeof action === 'object' && action !== null ? (action as { type?: string }).type : undefined
    if (!actionType || !isMutatingAction(actionType)) {
      return result
    }

    const state = storeApi.getState()
    if (state.vault.status !== VaultStatus.UNLOCKED) {
      return result
    }

    storeApi.dispatch(setSaveStatus(SaveStatus.SAVING))
    storeApi
      .dispatch(saveVaultThunk())
      .unwrap()
      .then(() => {
        storeApi.dispatch(setSaveStatus(SaveStatus.SAVED))
      })
      .catch((error: unknown) => {
        storeApi.dispatch(setSaveStatus(SaveStatus.ERROR))
        const message = error instanceof Error ? error.message : 'No se pudo guardar el cambio'
        storeApi.dispatch(setErrorMessage(message))
      })

    return result
  }

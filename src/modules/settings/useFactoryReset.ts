import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { useLoader } from '@/hooks/shared/useLoader'
import { hydrateAccounts } from '@/store/accounts/accountsSlice'
import { hydrateMovements } from '@/store/movements/movementsSlice'
import { hydratePayments } from '@/store/payments/paymentsSlice'
import { hydrateSavings } from '@/store/savings/savingsSlice'
import { hydrateSavingsGoals } from '@/store/savingsGoals/savingsGoalsSlice'
import { hydrateSavingsSnapshots } from '@/store/savingsSnapshots/savingsSnapshotsSlice'
import { hydrateMembers } from '@/store/household/membersSlice'
import { hydrateCategories } from '@/store/categories/categoriesSlice'
import { setHouseholdName } from '@/store/household/householdSlice'
import { saveVaultThunk } from '@/store/vault/vaultThunks'
import { buildDefaultCategories } from '@/utils/domain/buildDefaultCategories'
import { FactoryResetCategory } from './typings/enums'
import type { UseFactoryResetResult } from './typings/types'

export function useFactoryReset(onReset: () => void): UseFactoryResetResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (categories: FactoryResetCategory[]) => {
      run(async () => {
        if (categories.includes(FactoryResetCategory.ACCOUNTS)) {
          dispatch(hydrateAccounts([]))
        }
        if (categories.includes(FactoryResetCategory.MOVEMENTS)) {
          dispatch(hydrateMovements([]))
        }
        if (categories.includes(FactoryResetCategory.PAYMENTS)) {
          dispatch(hydratePayments([]))
        }
        if (categories.includes(FactoryResetCategory.SAVINGS)) {
          dispatch(hydrateSavings([]))
          dispatch(hydrateSavingsGoals([]))
          dispatch(hydrateSavingsSnapshots([]))
        }
        if (categories.includes(FactoryResetCategory.MEMBERS)) {
          dispatch(hydrateMembers([]))
        }
        if (categories.includes(FactoryResetCategory.CATEGORIES)) {
          dispatch(hydrateCategories(buildDefaultCategories()))
        }
        if (categories.includes(FactoryResetCategory.HOUSEHOLD_NAME)) {
          dispatch(setHouseholdName(''))
        }

        // Las acciones hydrate* no disparan el guardado automático (son las
        // que se usan para cargar el vault al desbloquear), así que hay que
        // guardar a mano acá.
        await dispatch(saveVaultThunk()).unwrap()
        onReset()
      }, 'No se pudo reiniciar la aplicación')
    },
    [dispatch, run, onReset]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

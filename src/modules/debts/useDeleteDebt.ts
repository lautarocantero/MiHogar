import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { removeDebt } from '@/store/debts/debtsSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { Debt } from '@/typings/domain/types'
import type { UseDeleteDebtResult } from './typings/types'

export function useDeleteDebt(debt: Debt, onDeleted: () => void): UseDeleteDebtResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(() => {
    run(async () => {
      dispatch(removeDebt(debt.id))
      dispatch(showToast('Deuda eliminada'))
      onDeleted()
    }, 'No se pudo eliminar la deuda')
  }, [dispatch, run, debt, onDeleted])

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

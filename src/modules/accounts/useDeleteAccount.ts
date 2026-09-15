import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { removeAccount } from '@/store/accounts/accountsSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { Account } from '@/typings/domain/types'
import type { UseDeleteAccountResult } from './typings/types'

export function useDeleteAccount(account: Account, onDeleted: () => void): UseDeleteAccountResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(() => {
    run(async () => {
      dispatch(removeAccount(account.id))
      onDeleted()
    }, 'No se pudo eliminar la cuenta')
  }, [dispatch, run, account, onDeleted])

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

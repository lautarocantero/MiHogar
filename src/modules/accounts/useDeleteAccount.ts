import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeAccount, updateAccount } from '@/store/accounts/accountsSlice'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { useLoader } from '@/hooks/shared/useLoader'
import type { Account } from '@/typings/domain/types'
import type { UseDeleteAccountResult } from './typings/types'

export function useDeleteAccount(account: Account, onDeleted: () => void): UseDeleteAccountResult {
  const dispatch = useAppDispatch()
  const allAccounts = useAppSelector(selectAllAccounts)
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(() => {
    run(async () => {
      const dependentCards = allAccounts.filter(
        (candidate) => candidate.sourceAccountId === account.id
      )
      for (const card of dependentCards) {
        dispatch(updateAccount({ ...card, sourceAccountId: undefined }))
      }
      dispatch(removeAccount(account.id))
      onDeleted()
    }, 'No se pudo eliminar la cuenta')
  }, [dispatch, run, account, allAccounts, onDeleted])

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { updateAccount } from '@/store/accounts/accountsSlice'

export function useReorderAccounts(): (orderedIds: string[]) => void {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAllAccounts)

  return useCallback(
    (orderedIds: string[]) => {
      orderedIds.forEach((id, index) => {
        const account = accounts.find((candidate) => candidate.id === id)
        if (account && account.sortOrder !== index) {
          dispatch(updateAccount({ ...account, sortOrder: index }))
        }
      })
    },
    [dispatch, accounts]
  )
}

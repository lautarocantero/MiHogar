import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateAccount } from '@/store/accounts/accountsSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { AccountType, OwnerType } from '@/typings/domain/enums'
import type { Account } from '@/typings/domain/types'
import type { AddAccountFormValues, UseUpdateAccountResult } from './typings/types'

export function useUpdateAccount(account: Account, onUpdated: () => void): UseUpdateAccountResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddAccountFormValues) => {
      run(async () => {
        dispatch(
          updateAccount({
            ...account,
            name: values.name,
            type: values.type,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined,
            balance: values.balance,
            contextPhrase: values.contextPhrase || undefined,
            closingDay: values.type === AccountType.CREDIT_CARD ? values.closingDay : undefined,
            dueDay: values.type === AccountType.CREDIT_CARD ? values.dueDay : undefined,
            installmentsRemaining:
              values.type === AccountType.CREDIT_CARD ? values.installmentsRemaining : undefined
          })
        )
        onUpdated()
      }, 'No se pudo guardar la cuenta')
    },
    [dispatch, run, account, onUpdated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

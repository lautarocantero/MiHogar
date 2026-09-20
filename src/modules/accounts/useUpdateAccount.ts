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
        const isCreditCard = values.type === AccountType.CREDIT_CARD
        dispatch(
          updateAccount({
            ...account,
            name: values.name,
            type: values.type,
            currency: values.currency,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined,
            balance: isCreditCard ? 0 : (values.balance ?? 0),
            contextPhrase: values.contextPhrase || undefined,
            sourceAccountId: isCreditCard ? values.sourceAccountId : undefined,
            creditLimit: isCreditCard ? values.creditLimit : undefined,
            usedAmount: isCreditCard ? values.usedAmount : undefined,
            closingDay: isCreditCard ? values.closingDay : undefined,
            dueDay: isCreditCard ? values.dueDay : undefined,
            nextClosingDay: isCreditCard ? values.nextClosingDay : undefined,
            nextDueDay: isCreditCard ? values.nextDueDay : undefined,
            color: values.color
          })
        )
        onUpdated()
      }, 'No se pudo guardar la cuenta')
    },
    [dispatch, run, account, onUpdated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

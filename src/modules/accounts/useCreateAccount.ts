import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addAccount } from '@/store/accounts/accountsSlice'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { useLoader } from '@/hooks/shared/useLoader'
import { AccountType, OwnerType } from '@/typings/domain/enums'
import type { AddAccountFormValues, UseCreateAccountResult } from './typings/types'

export function useCreateAccount(onCreated: () => void): UseCreateAccountResult {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAllAccounts)
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddAccountFormValues) => {
      run(async () => {
        const isCreditCard = values.type === AccountType.CREDIT_CARD
        dispatch(
          addAccount({
            id: uuidv4(),
            name: values.name,
            type: values.type,
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
            color: values.color,
            sortOrder: accounts.length
          })
        )
        onCreated()
      }, 'No se pudo agregar la cuenta')
    },
    [dispatch, run, onCreated, accounts]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

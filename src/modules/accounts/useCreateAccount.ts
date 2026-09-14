import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addAccount } from '@/store/accounts/accountsSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { OwnerType } from '@/typings/domain/enums'
import type { AddAccountFormValues, UseCreateAccountResult } from './typings/types'

export function useCreateAccount(onCreated: () => void): UseCreateAccountResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddAccountFormValues) => {
      run(async () => {
        dispatch(
          addAccount({
            id: uuidv4(),
            name: values.name,
            type: values.type,
            ownerType: values.ownerType,
            ownerId: values.ownerType === OwnerType.MEMBER ? values.ownerId : undefined,
            balance: values.balance,
            contextPhrase: values.contextPhrase || undefined,
            closingDay: values.closingDay,
            dueDay: values.dueDay,
            installmentsRemaining: values.installmentsRemaining
          })
        )
        onCreated()
      }, 'No se pudo agregar la cuenta')
    },
    [dispatch, run, onCreated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

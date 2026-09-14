import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addMember } from '@/store/household/membersSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { AddMemberFormValues, UseAddMemberResult } from './typings/types'

export function useAddMember(onCreated: () => void): UseAddMemberResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddMemberFormValues) => {
      run(async () => {
        dispatch(addMember({ id: uuidv4(), name: values.name }))
        onCreated()
      }, 'No se pudo agregar el integrante')
    },
    [dispatch, run, onCreated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

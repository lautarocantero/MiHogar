import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addMember } from '@/store/household/membersSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import type { AddMemberFormValues, UseAddMemberResult } from './typings/types'

export function useAddMember(onCreated: (memberId: string) => void): UseAddMemberResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddMemberFormValues) => {
      run(async () => {
        const id = uuidv4()
        dispatch(addMember({ id, name: values.name }))
        onCreated(id)
      }, 'No se pudo agregar el integrante')
    },
    [dispatch, run, onCreated]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

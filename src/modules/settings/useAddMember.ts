import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addMember } from '@/store/household/membersSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { useT } from '@/i18n'
import type { AddMemberFormValues, UseAddMemberResult } from './typings/types'

export function useAddMember(onCreated: (memberId: string) => void): UseAddMemberResult {
  const t = useT()
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const submit = useCallback(
    (values: AddMemberFormValues) => {
      run(async () => {
        const id = uuidv4()
        dispatch(addMember({ id, name: values.name }))
        onCreated(id)
      }, t('settings.members.addFailed'))
    },
    [dispatch, run, onCreated, t]
  )

  return { submit, isSubmitting: isLoading, errorMessage: error }
}

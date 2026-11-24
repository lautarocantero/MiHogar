import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAuthStatus } from '@/store/auth/authSelectors'
import { initAuthThunk } from '@/store/auth/authThunks'
import type { AuthStatus } from '@/store/auth/typings/enums'

export function useAuthGateStatus(): AuthStatus {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectAuthStatus)

  useEffect(() => {
    dispatch(initAuthThunk())
  }, [dispatch])

  return status
}

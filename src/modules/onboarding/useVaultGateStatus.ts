import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectVaultStatus } from '@/store/vault/vaultSelectors'
import { checkVaultExistsThunk } from '@/store/vault/vaultThunks'
import { VaultStatus } from '@/store/vault/typings/enums'

export function useVaultGateStatus(): VaultStatus {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectVaultStatus)

  useEffect(() => {
    dispatch(checkVaultExistsThunk())
  }, [dispatch])

  return status
}

import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectVaultError, selectVaultStatus } from '@/store/vault/vaultSelectors'
import { checkVaultExistsThunk } from '@/store/vault/vaultThunks'
import { VaultStatus } from '@/store/vault/typings/enums'
import type { UseVaultGateStatusResult } from './typings/types'

export function useVaultGateStatus(): UseVaultGateStatusResult {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectVaultStatus)
  const errorMessage = useAppSelector(selectVaultError)
  const [isChecking, setIsChecking] = useState(false)

  const check = useCallback(() => {
    setIsChecking(true)
    dispatch(checkVaultExistsThunk()).finally(() => setIsChecking(false))
  }, [dispatch])

  useEffect(() => {
    // Solo se consulta la nube cuando hace falta: no al entrar a la demo ni con el
    // vault ya abierto.
    if (status === VaultStatus.CHECKING) {
      check()
    }
  }, [status, check])

  return {
    status,
    errorMessage: status === VaultStatus.CHECKING ? errorMessage : null,
    isChecking,
    retry: check
  }
}

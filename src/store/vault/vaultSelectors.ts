import type { RootState } from '@/store'
import { VaultStatus } from './typings/enums'

export const selectVaultStatus = (state: RootState): VaultStatus => state.vault.status

export const selectVaultError = (state: RootState): string | null => state.vault.error

export const selectIsDemoMode = (state: RootState): boolean =>
  state.vault.status === VaultStatus.DEMO

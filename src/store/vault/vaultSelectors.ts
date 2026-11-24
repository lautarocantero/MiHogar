import type { RootState } from '@/store'
import type { VaultLockReason } from './typings/enums'
import { VaultStatus } from './typings/enums'

export const selectVaultStatus = (state: RootState): VaultStatus => state.vault.status

export const selectVaultError = (state: RootState): string | null => state.vault.error

export const selectVaultLockReason = (state: RootState): VaultLockReason | null =>
  state.vault.lockReason

export const selectIsDemoMode = (state: RootState): boolean =>
  state.vault.status === VaultStatus.DEMO

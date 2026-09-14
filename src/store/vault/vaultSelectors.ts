import type { RootState } from '@/store'
import type { VaultStatus } from './typings/enums'

export const selectVaultStatus = (state: RootState): VaultStatus => state.vault.status

export const selectVaultError = (state: RootState): string | null => state.vault.error

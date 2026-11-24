import type { VaultEnvelope } from '@shared/vaultEnvelope.types'
import type { VaultLockReason, VaultStatus } from './enums'

export type VaultState = {
  status: VaultStatus
  error: string | null
  lockReason: VaultLockReason | null
}

export type ChangeHouseholdKeyInput = {
  currentKey: string
  newKey: string
}

export type RestoreVaultInput = {
  envelope: VaultEnvelope
  householdKey: string
  /** `true` para pisar el vault que ya tiene la cuenta (pide confirmación en la UI). */
  replace: boolean
}

export type ReloadRemoteVaultReason = 'conflict' | 'remoteNewer'

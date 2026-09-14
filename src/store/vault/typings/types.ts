import type { VaultStatus } from './enums'

export type VaultState = {
  status: VaultStatus
  error: string | null
}

export type ChangeHouseholdKeyInput = {
  currentKey: string
  newKey: string
}

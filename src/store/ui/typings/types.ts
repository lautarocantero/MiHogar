import type { SaveStatus } from './enums'

export type UiState = {
  saveStatus: SaveStatus
  errorMessage: string | null
}

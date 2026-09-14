import type { PreferencesFile } from '@shared/vaultEnvelope.types'

export function getPreferences(): Promise<PreferencesFile> {
  return window.preferencesApi.get()
}

export function setPreferences(preferences: PreferencesFile): Promise<void> {
  return window.preferencesApi.set(preferences)
}

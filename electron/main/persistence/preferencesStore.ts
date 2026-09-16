import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { PreferencesFile } from '@shared/vaultEnvelope.types'
import { getPreferencesFilePath } from './vaultPaths'

const DEFAULT_PREFERENCES: PreferencesFile = {
  fontSizeLevel: 'normal',
  remindersEnabled: true,
  reminderLeadDays: 1
}

export async function readPreferences(): Promise<PreferencesFile> {
  const path = getPreferencesFilePath()
  if (!existsSync(path)) {
    return DEFAULT_PREFERENCES
  }
  const raw = await readFile(path, 'utf8')
  return { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<PreferencesFile>) }
}

export async function writePreferences(preferences: PreferencesFile): Promise<void> {
  await writeFile(getPreferencesFilePath(), JSON.stringify(preferences), 'utf8')
}

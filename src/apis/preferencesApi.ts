import type { PreferencesFile } from '@shared/vaultEnvelope.types'

/**
 * Preferencias por dispositivo (tamaño de letra, formato de fecha, recordatorios) en
 * `localStorage`. Si el almacenamiento no está disponible se usan los valores por
 * defecto y no se rompe nada.
 */
const STORAGE_KEY = 'mihogar.preferences'

const DEFAULT_PREFERENCES: PreferencesFile = {
  fontSizeLevel: 'normal',
  remindersEnabled: true,
  reminderLeadDays: 1,
  dateFormat: 'DMY'
}

const FONT_SIZE_LEVELS: PreferencesFile['fontSizeLevel'][] = [
  'xsmall',
  'small',
  'normal',
  'large',
  'xlarge'
]

function sanitize(raw: unknown): PreferencesFile {
  if (typeof raw !== 'object' || raw === null) return { ...DEFAULT_PREFERENCES }
  const candidate = raw as Partial<Record<keyof PreferencesFile, unknown>>
  return {
    fontSizeLevel: FONT_SIZE_LEVELS.includes(
      candidate.fontSizeLevel as PreferencesFile['fontSizeLevel']
    )
      ? (candidate.fontSizeLevel as PreferencesFile['fontSizeLevel'])
      : DEFAULT_PREFERENCES.fontSizeLevel,
    remindersEnabled:
      typeof candidate.remindersEnabled === 'boolean'
        ? candidate.remindersEnabled
        : DEFAULT_PREFERENCES.remindersEnabled,
    reminderLeadDays:
      typeof candidate.reminderLeadDays === 'number' &&
      Number.isInteger(candidate.reminderLeadDays) &&
      candidate.reminderLeadDays >= 0 &&
      candidate.reminderLeadDays <= 31
        ? candidate.reminderLeadDays
        : DEFAULT_PREFERENCES.reminderLeadDays,
    dateFormat:
      candidate.dateFormat === 'DMY' || candidate.dateFormat === 'MDY'
        ? candidate.dateFormat
        : DEFAULT_PREFERENCES.dateFormat
  }
}

export async function getPreferences(): Promise<PreferencesFile> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? sanitize(JSON.parse(raw)) : { ...DEFAULT_PREFERENCES }
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

export async function setPreferences(preferences: PreferencesFile): Promise<void> {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitize(preferences)))
  } catch {
    // Sin almacenamiento (modo privado, cuota llena): la preferencia vale solo esta sesión.
  }
}

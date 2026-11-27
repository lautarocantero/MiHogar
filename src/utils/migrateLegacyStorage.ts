/** Copia las claves de localStorage del nombre anterior (mihogar.*) a gastito.*, una sola vez. */
const LEGACY_KEYS: Array<[string, string]> = [
  ['mihogar.notifiedReminders', 'gastito.notifiedReminders'],
  ['mihogar.preferences', 'gastito.preferences'],
  ['mihogar.locale', 'gastito.locale'],
  ['mihogar.auth', 'gastito.auth'],
  ['miHogar.calendar.monthOffset', 'gastito.calendar.monthOffset']
]

try {
  LEGACY_KEYS.forEach(([legacy, current]) => {
    const value = window.localStorage.getItem(legacy)
    if (value !== null && window.localStorage.getItem(current) === null) {
      window.localStorage.setItem(current, value)
    }
    window.localStorage.removeItem(legacy)
  })
} catch {
  // localStorage no disponible
}

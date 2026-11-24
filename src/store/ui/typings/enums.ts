export enum SaveStatus {
  IDLE = 'IDLE',
  /** Hay cambios locales esperando el debounce para subirse. */
  PENDING = 'PENDING',
  SAVING = 'SAVING',
  SAVED = 'SAVED',
  /** Sin conexión: los cambios quedan pendientes y se reintenta al volver la red. */
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
  /** Otro dispositivo guardó mientras había cambios locales: el usuario elige versión. */
  CONFLICT = 'CONFLICT'
}

/** Por qué se frenó una salida (cerrar sesión / bloquear) que perdería cambios sin guardar. */
export enum PendingExitReason {
  SIGN_OUT = 'SIGN_OUT',
  LOCK = 'LOCK',
  /** La sesión venció o se cerró desde otra pestaña: ya no se puede guardar. */
  SESSION_ENDED = 'SESSION_ENDED',
  /** La clave del hogar se cambió en otro dispositivo: ya no se puede guardar. */
  KEY_CHANGED = 'KEY_CHANGED'
}

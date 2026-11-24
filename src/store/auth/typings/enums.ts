export enum AuthStatus {
  INITIALIZING = 'INITIALIZING',
  CONFIG_ERROR = 'CONFIG_ERROR',
  SIGNED_OUT = 'SIGNED_OUT',
  SIGNED_IN = 'SIGNED_IN',
  /** Llegó desde el link de "restablecer contraseña": tiene que elegir una nueva. */
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY'
}

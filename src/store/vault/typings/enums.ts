export enum VaultStatus {
  CHECKING = 'CHECKING',
  NOT_CREATED = 'NOT_CREATED',
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  DEMO = 'DEMO'
}

/** Por qué se bloqueó el vault sin que el usuario lo pidiera. */
export enum VaultLockReason {
  /** La clave del hogar se cambió (o se restauró un respaldo) desde otro dispositivo. */
  KEY_CHANGED = 'KEY_CHANGED'
}

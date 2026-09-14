export const IPC_CHANNELS = {
  VAULT_EXISTS: 'vault:exists',
  VAULT_CREATE: 'vault:create',
  VAULT_UNLOCK: 'vault:unlock',
  VAULT_SAVE: 'vault:save',
  VAULT_CHANGE_KEY: 'vault:changeKey',
  VAULT_EXPORT: 'vault:export',
  VAULT_IMPORT: 'vault:import',
  VAULT_LOCK: 'vault:lock',
  VAULT_VERIFY_KEY: 'vault:verifyKey',
  ATTACHMENT_SAVE: 'attachment:save',
  ATTACHMENT_OPEN: 'attachment:open',
  ATTACHMENT_REMOVE: 'attachment:remove',
  PREFS_GET: 'prefs:get',
  PREFS_SET: 'prefs:set',
  REMINDERS_CHECK: 'reminders:check'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]

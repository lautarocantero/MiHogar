import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type {
  AttachmentSavePayload,
  AttachmentSaveResult,
  ParseStatementPayload,
  ParseStatementResult,
  PickStatementFileResult,
  PreferencesFile,
  ReminderNotification
} from '@shared/vaultEnvelope.types'

const vaultApi = {
  exists: (): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.VAULT_EXISTS),
  create: (householdKey: string): Promise<unknown> =>
    ipcRenderer.invoke(IPC_CHANNELS.VAULT_CREATE, householdKey),
  unlock: (householdKey: string): Promise<unknown> =>
    ipcRenderer.invoke(IPC_CHANNELS.VAULT_UNLOCK, householdKey),
  lock: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.VAULT_LOCK),
  verifyKey: (candidateKey: string): Promise<boolean> =>
    ipcRenderer.invoke(IPC_CHANNELS.VAULT_VERIFY_KEY, candidateKey),
  save: (vaultJson: unknown): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.VAULT_SAVE, vaultJson),
  changeKey: (currentKey: string, newKey: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.VAULT_CHANGE_KEY, currentKey, newKey),
  exportBackup: (): Promise<string | null> => ipcRenderer.invoke(IPC_CHANNELS.VAULT_EXPORT),
  importBackup: (): Promise<boolean> => ipcRenderer.invoke(IPC_CHANNELS.VAULT_IMPORT)
}

const attachmentsApi = {
  save: (payload: AttachmentSavePayload): Promise<AttachmentSaveResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.ATTACHMENT_SAVE, payload),
  open: (relativePath: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.ATTACHMENT_OPEN, relativePath),
  remove: (relativePath: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.ATTACHMENT_REMOVE, relativePath)
}

const preferencesApi = {
  get: (): Promise<PreferencesFile> => ipcRenderer.invoke(IPC_CHANNELS.PREFS_GET),
  set: (preferences: PreferencesFile): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.PREFS_SET, preferences)
}

const remindersApi = {
  check: (reminders: ReminderNotification[]): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.REMINDERS_CHECK, reminders)
}

const tasksStorageApi = {
  load: (): Promise<unknown> => ipcRenderer.invoke(IPC_CHANNELS.TASKS_LOAD),
  save: (tasksJson: unknown): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.TASKS_SAVE, tasksJson)
}

const importStatementsApi = {
  pickFile: (): Promise<PickStatementFileResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_STATEMENTS_PICK_FILE),
  parse: (payload: ParseStatementPayload): Promise<ParseStatementResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_STATEMENTS_PARSE, payload)
}

contextBridge.exposeInMainWorld('vaultApi', vaultApi)
contextBridge.exposeInMainWorld('attachmentsApi', attachmentsApi)
contextBridge.exposeInMainWorld('preferencesApi', preferencesApi)
contextBridge.exposeInMainWorld('remindersApi', remindersApi)
contextBridge.exposeInMainWorld('tasksStorageApi', tasksStorageApi)
contextBridge.exposeInMainWorld('importStatementsApi', importStatementsApi)

export type VaultApi = typeof vaultApi
export type AttachmentsApi = typeof attachmentsApi
export type PreferencesApi = typeof preferencesApi
export type RemindersApi = typeof remindersApi
export type TasksStorageApi = typeof tasksStorageApi
export type ImportStatementsApi = typeof importStatementsApi

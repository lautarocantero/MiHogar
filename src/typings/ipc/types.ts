import type {
  AttachmentSavePayload,
  AttachmentSaveResult,
  ParseStatementPayload,
  ParseStatementResult,
  PickStatementFileResult,
  PreferencesFile,
  ReminderNotification
} from '@shared/vaultEnvelope.types'

export type VaultApi = {
  exists: () => Promise<boolean>
  create: (householdKey: string) => Promise<unknown>
  unlock: (householdKey: string) => Promise<unknown>
  lock: () => Promise<void>
  verifyKey: (candidateKey: string) => Promise<boolean>
  save: (vaultJson: unknown) => Promise<void>
  changeKey: (currentKey: string, newKey: string) => Promise<void>
  exportBackup: () => Promise<string | null>
  importBackup: () => Promise<boolean>
}

export type AttachmentsApi = {
  save: (payload: AttachmentSavePayload) => Promise<AttachmentSaveResult>
  open: (relativePath: string) => Promise<void>
  remove: (relativePath: string) => Promise<void>
}

export type PreferencesApi = {
  get: () => Promise<PreferencesFile>
  set: (preferences: PreferencesFile) => Promise<void>
}

export type RemindersApi = {
  check: (reminders: ReminderNotification[]) => Promise<void>
}

export type ImportStatementsApi = {
  pickFile: () => Promise<PickStatementFileResult>
  parse: (payload: ParseStatementPayload) => Promise<ParseStatementResult>
}

declare global {
  interface Window {
    vaultApi: VaultApi
    attachmentsApi: AttachmentsApi
    preferencesApi: PreferencesApi
    remindersApi: RemindersApi
    importStatementsApi: ImportStatementsApi
  }
}

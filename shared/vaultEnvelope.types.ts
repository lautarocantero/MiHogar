export type VaultEnvelope = {
  v: 1
  kdf: 'pbkdf2'
  iterations: number
  salt: string
  iv: string
  authTag: string
  ciphertext: string
}

export type PreferencesFile = {
  fontSizeLevel: 'xsmall' | 'small' | 'normal' | 'large' | 'xlarge'
  remindersEnabled: boolean
  reminderLeadDays: number
  githubTasksToken?: string
  dateFormat: 'DMY' | 'MDY'
}

export type TaskLink = {
  id: string
  repo: string
  type: 'pr' | 'issue'
  number: number
  url: string
  title?: string
  state?: 'open' | 'closed' | 'merged' | 'draft'
  stateReason?: 'completed' | 'not_planned' | 'reopened'
  approved?: boolean
  mergedAt?: string
  mergeCommitSha?: string
  etag?: string
  syncedAt?: string
  syncError?: string
}

export type TaskDoc = {
  id: string
  seq: number
  title: string
  description: string
  statusId: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  categoryIds: string[]
  repos: string[]
  links: TaskLink[]
  checklist: { id: string; text: string; done: boolean }[]
  notes: { id: string; text: string; createdAt: string }[]
  startDate?: string
  dueDate?: string
  rank: number
  archivedAt?: string
  createdAt: string
  updatedAt: string
  updatedBy: 'user' | 'github'
}

export type TaskCategory = {
  id: string
  label: string
  color: string
}

export type TasksFile = {
  version: 1
  tasks: TaskDoc[]
  categories: TaskCategory[]
  nextSeq: number
}

export type AttachmentSavePayload = {
  paymentId: string
  fileName: string
  fileData: string
}

export type AttachmentSaveResult = {
  relativePath: string
  sizeBytes: number
}

export type ReminderNotification = {
  paymentId: string
  concept: string
  dueDate: string
  amount: number
  kind?: 'payment' | 'debt'
}

export type StatementSource = 'MERCADO_PAGO' | 'GALICIA'
export type StatementFileFormat = 'EXCEL_CSV' | 'PDF'

export type PickStatementFileResult = {
  fileData: string
  fileName: string
} | null

export type ParseStatementPayload = {
  source: StatementSource
  format: StatementFileFormat
  fileData: string
  fileName: string
}

export type ParsedStatementRowDto = {
  date: string
  amount: number
  description: string
  sourceRef?: string
}

export type ParseStatementResult = {
  rows: ParsedStatementRowDto[]
  skippedCount: number
}

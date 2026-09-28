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
  dateFormat: 'DMY' | 'MDY'
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

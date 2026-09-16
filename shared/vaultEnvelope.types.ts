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
}

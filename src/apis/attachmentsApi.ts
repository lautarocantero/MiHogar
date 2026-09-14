import type { AttachmentSavePayload, AttachmentSaveResult } from '@shared/vaultEnvelope.types'

export function saveAttachment(payload: AttachmentSavePayload): Promise<AttachmentSaveResult> {
  return window.attachmentsApi.save(payload)
}

export function openAttachment(relativePath: string): Promise<void> {
  return window.attachmentsApi.open(relativePath)
}

export function removeAttachment(relativePath: string): Promise<void> {
  return window.attachmentsApi.remove(relativePath)
}

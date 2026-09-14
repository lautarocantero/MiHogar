import { mkdir, rm, writeFile } from 'fs/promises'
import { dirname, join, normalize } from 'path'
import { shell } from 'electron'
import type { AttachmentSaveResult } from '@shared/vaultEnvelope.types'
import { getAttachmentsDir } from './vaultPaths'

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[/\\?%*:|"<>]/g, '_')
}

function assertInsideAttachmentsDir(fullPath: string): void {
  const attachmentsDir = getAttachmentsDir()
  const normalized = normalize(fullPath)
  if (!normalized.startsWith(normalize(attachmentsDir))) {
    throw new Error('Ruta de adjunto inválida')
  }
}

export async function saveAttachment(
  paymentId: string,
  attachmentId: string,
  fileName: string,
  fileData: Buffer
): Promise<AttachmentSaveResult> {
  const relativePath = join(paymentId, `${attachmentId}__${sanitizeFileName(fileName)}`)
  const fullPath = join(getAttachmentsDir(), relativePath)
  assertInsideAttachmentsDir(fullPath)

  await mkdir(dirname(fullPath), { recursive: true })
  await writeFile(fullPath, fileData)

  return { relativePath, sizeBytes: fileData.byteLength }
}

export async function openAttachment(relativePath: string): Promise<void> {
  const fullPath = join(getAttachmentsDir(), relativePath)
  assertInsideAttachmentsDir(fullPath)
  const errorMessage = await shell.openPath(fullPath)
  if (errorMessage) {
    throw new Error(errorMessage)
  }
}

export async function removeAttachment(relativePath: string): Promise<void> {
  const fullPath = join(getAttachmentsDir(), relativePath)
  assertInsideAttachmentsDir(fullPath)
  await rm(fullPath, { force: true })
}

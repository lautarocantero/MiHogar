import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type { AttachmentSavePayload } from '@shared/vaultEnvelope.types'
import { saveAttachment, openAttachment, removeAttachment } from '../persistence/attachmentsStorage'
import { v4 as uuidv4 } from 'uuid'

export function registerAttachmentHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.ATTACHMENT_SAVE, async (_event, payload: AttachmentSavePayload) => {
    const fileBuffer = Buffer.from(payload.fileData, 'base64')
    return saveAttachment(payload.paymentId, uuidv4(), payload.fileName, fileBuffer)
  })

  ipcMain.handle(IPC_CHANNELS.ATTACHMENT_OPEN, (_event, relativePath: string) => {
    return openAttachment(relativePath)
  })

  ipcMain.handle(IPC_CHANNELS.ATTACHMENT_REMOVE, (_event, relativePath: string) => {
    return removeAttachment(relativePath)
  })
}

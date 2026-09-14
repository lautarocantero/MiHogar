import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { updatePayment } from '@/store/payments/paymentsSlice'
import { saveAttachment, openAttachment, removeAttachment } from '@/apis/attachmentsApi'
import { readFileAsBase64 } from '@/utils/readFileAsBase64'
import { useLoader } from '@/hooks/shared/useLoader'
import type { PaymentView, UseAttachmentsResult } from '../typings/types'

export function useAttachments(payment: PaymentView): UseAttachmentsResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()

  const uploadFile = useCallback(
    (file: File) => {
      run(async () => {
        const fileData = await readFileAsBase64(file)
        const result = await saveAttachment({
          paymentId: payment.id,
          fileName: file.name,
          fileData
        })
        dispatch(
          updatePayment({
            ...payment,
            attachments: [
              ...payment.attachments,
              {
                id: uuidv4(),
                paymentId: payment.id,
                fileName: file.name,
                mimeType: file.type || 'application/octet-stream',
                sizeBytes: result.sizeBytes,
                relativePath: result.relativePath,
                createdAt: new Date().toISOString()
              }
            ]
          })
        )
      }, 'No se pudo guardar el archivo')
    },
    [dispatch, run, payment]
  )

  const openFile = useCallback(
    (relativePath: string) => {
      run(() => openAttachment(relativePath), 'No se pudo abrir el archivo')
    },
    [run]
  )

  const removeFile = useCallback(
    (attachmentId: string, relativePath: string) => {
      run(async () => {
        await removeAttachment(relativePath)
        dispatch(
          updatePayment({
            ...payment,
            attachments: payment.attachments.filter((a) => a.id !== attachmentId)
          })
        )
      }, 'No se pudo borrar el archivo')
    },
    [dispatch, run, payment]
  )

  return { uploadFile, openFile, removeFile, isLoading, errorMessage: error }
}

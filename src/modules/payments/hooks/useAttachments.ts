import { useCallback } from 'react'
import { useStore } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import type { RootState } from '@/store'
import { paymentsSelectors, updatePayment } from '@/store/payments/paymentsSlice'
import { saveAttachment, openAttachment, removeAttachment } from '@/apis/attachmentsApi'
import { useLoader } from '@/hooks/shared/useLoader'
import { saveVaultNow } from '@/store/middleware/vaultSaveControl'
import { useT } from '@/i18n'
import type { AttachmentMeta, Payment } from '@/typings/domain/types'
import type { PaymentView, UseAttachmentsResult } from '../typings/types'

export function useAttachments(payment: PaymentView): UseAttachmentsResult {
  const dispatch = useAppDispatch()
  const store = useStore<RootState>()
  const t = useT()
  const { isLoading, error, run } = useLoader()
  const paymentId = payment.id

  // Se lee el pago del store al momento de guardar: entre que empieza y termina la
  // subida pueden haber cambiado sus adjuntos.
  const updateAttachments = useCallback(
    (change: (attachments: AttachmentMeta[]) => AttachmentMeta[]) => {
      const current: Payment | undefined = paymentsSelectors.selectById(
        store.getState().payments,
        paymentId
      )
      if (!current) return
      dispatch(updatePayment({ ...current, attachments: change(current.attachments) }))
    },
    [dispatch, store, paymentId]
  )

  /**
   * Sube el archivo y guarda YA el vault: la clave del adjunto vive solo en el vault, así
   * que si el guardado no llega a la nube el objeto subido sería ilegible. Si el guardado
   * falla se saca la referencia y se borra el objeto huérfano.
   */
  const uploadFile = useCallback(
    (file: File) => {
      run(async () => {
        const stored = await saveAttachment(paymentId, file)
        const attachmentId = uuidv4()
        updateAttachments((attachments) => [
          ...attachments,
          {
            id: attachmentId,
            paymentId,
            fileName: file.name || stored.relativePath,
            mimeType: file.type || 'application/octet-stream',
            sizeBytes: stored.sizeBytes,
            relativePath: stored.relativePath,
            encryptionKey: stored.encryptionKey,
            createdAt: new Date().toISOString()
          }
        ])
        try {
          await saveVaultNow()
        } catch (error) {
          updateAttachments((attachments) => attachments.filter((a) => a.id !== attachmentId))
          await removeAttachment(stored).catch((cleanupError: unknown) => {
            console.warn('No se pudo borrar el adjunto huérfano', cleanupError)
          })
          throw error
        }
      }, t('attachments.errors.uploadFailed'))
    },
    [run, paymentId, updateAttachments, t]
  )

  const openFile = useCallback(
    (attachment: AttachmentMeta) => {
      run(() => openAttachment(attachment), t('attachments.errors.openFailed'))
    },
    [run, t]
  )

  const removeFile = useCallback(
    (attachment: AttachmentMeta) => {
      // Primero se saca del vault (y se guarda): si después falla el borrado del objeto
      // queda un archivo huérfano ilegible, nunca una referencia a un archivo que no existe.
      run(async () => {
        updateAttachments((attachments) => attachments.filter((a) => a.id !== attachment.id))
        try {
          await saveVaultNow()
        } catch (error) {
          updateAttachments((attachments) =>
            attachments.some((a) => a.id === attachment.id)
              ? attachments
              : [...attachments, attachment]
          )
          throw error
        }
        await removeAttachment(attachment).catch((cleanupError: unknown) => {
          console.warn('No se pudo borrar el archivo de la nube', cleanupError)
        })
      }, t('attachments.errors.removeFailed'))
    },
    [run, updateAttachments, t]
  )

  return { uploadFile, openFile, removeFile, isLoading, errorMessage: error }
}

import { v4 as uuidv4 } from 'uuid'
import type { AttachmentMeta } from '@/typings/domain/types'
import { getSupabase } from './cloud/supabaseClient'
import { AppError, toCloudError } from './cloud/errors'
import {
  ATTACHMENT_ENCRYPTION_OVERHEAD_BYTES,
  decryptAttachmentBytes,
  encryptAttachmentBytes
} from './cloud/vaultCrypto'
import { requireVaultSession } from './cloud/vaultSession'
import { downloadBlob, isDesktopApp } from './cloud/browserFiles'

/**
 * Adjuntos cifrados en Supabase Storage (bucket privado `attachments`).
 * Ruta del objeto: `<uid>/<relativePath>` con `relativePath = <paymentId>/<uuid>__<nombre>`.
 * El `relativePath` que se guarda en el vault no incluye el uid, igual que antes.
 */
const BUCKET = 'attachments'
/** Límite del bucket (`file_size_limit` = 26214400): aplica al objeto ya cifrado. */
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024
const ENCRYPTED_OBJECT_TYPE = 'application/octet-stream'
const MAX_FILE_NAME_LENGTH = 80
// Tipos que se pueden mostrar en una pestaña sin ejecutar código (SVG/HTML quedan afuera).
const INLINE_VIEWABLE_TYPES = /^(application\/pdf|image\/(png|jpe?g|gif|webp|bmp|avif))$/i

export type StoredAttachment = Pick<AttachmentMeta, 'relativePath' | 'sizeBytes' | 'encryptionKey'>

export function sanitizeAttachmentFileName(fileName: string): string {
  const cleaned = fileName
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/^[._]+/, '')
  const trimmed = cleaned.slice(-MAX_FILE_NAME_LENGTH)
  return trimmed.length > 0 ? trimmed : 'archivo'
}

function buildObjectPath(userId: string, relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, '/')
  if (normalized.split('/').some((segment) => segment === '..' || segment === '')) {
    throw new AppError('attachments.errors.missing')
  }
  return `${userId}/${normalized}`
}

export async function saveAttachment(paymentId: string, file: File): Promise<StoredAttachment> {
  if (file.size + ATTACHMENT_ENCRYPTION_OVERHEAD_BYTES > MAX_ATTACHMENT_BYTES) {
    throw new AppError('attachments.errors.tooLarge')
  }
  const { userId } = requireVaultSession()
  const plainBytes = new Uint8Array(await file.arrayBuffer())
  const { payload, keyBase64 } = await encryptAttachmentBytes(plainBytes)
  const relativePath = `${paymentId}/${uuidv4()}__${sanitizeAttachmentFileName(file.name)}`

  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(buildObjectPath(userId, relativePath), new Blob([payload]), {
      contentType: ENCRYPTED_OBJECT_TYPE,
      upsert: false
    })
  if (error) throw toCloudError(error)

  return { relativePath, sizeBytes: file.size, encryptionKey: keyBase64 }
}

async function downloadAndDecrypt(attachment: AttachmentMeta): Promise<Blob> {
  if (!attachment.encryptionKey) {
    throw new AppError('attachments.errors.notInCloud')
  }
  const { userId } = requireVaultSession()
  const { data, error } = await getSupabase()
    .storage.from(BUCKET)
    .download(buildObjectPath(userId, attachment.relativePath))
  if (error || !data) {
    // Storage responde 400/404 cuando el objeto no existe.
    const status = (error as { status?: number } | null)?.status
    if (status === 404 || status === 400) throw new AppError('attachments.errors.missing')
    throw toCloudError(error)
  }
  const plainBytes = await decryptAttachmentBytes(
    new Uint8Array(await data.arrayBuffer()),
    attachment.encryptionKey
  )
  return new Blob([plainBytes], { type: attachment.mimeType || ENCRYPTED_OBJECT_TYPE })
}

function canOpenInline(attachment: AttachmentMeta): boolean {
  return !isDesktopApp() && INLINE_VIEWABLE_TYPES.test(attachment.mimeType)
}

/**
 * Descarga y descifra en memoria. En la web abre el archivo en una pestaña nueva si es
 * un tipo seguro (PDF o imagen); si no, si el navegador bloquea la pestaña o en la app
 * de escritorio, lo descarga.
 *
 * Llamarla directo desde el click: la pestaña se abre ANTES de descargar (los navegadores
 * bloquean `window.open` después de un `await`) y se completa cuando el archivo está listo.
 */
export async function openAttachment(attachment: AttachmentMeta): Promise<void> {
  const targetWindow = canOpenInline(attachment) ? window.open('', '_blank') : null
  let blob: Blob
  try {
    blob = await downloadAndDecrypt(attachment)
  } catch (error) {
    targetWindow?.close()
    throw error
  }

  if (targetWindow && !targetWindow.closed) {
    const url = URL.createObjectURL(blob)
    targetWindow.opener = null
    targetWindow.location.href = url
    window.setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000)
    return
  }

  downloadBlob(blob, attachment.fileName)
}

export async function removeAttachment(
  attachment: Pick<AttachmentMeta, 'relativePath' | 'encryptionKey'>
): Promise<void> {
  // Un adjunto viejo (sin clave) nunca se subió: solo se borra la referencia.
  if (!attachment.encryptionKey) return
  const { userId } = requireVaultSession()
  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .remove([buildObjectPath(userId, attachment.relativePath)])
  if (error) throw toCloudError(error)
}

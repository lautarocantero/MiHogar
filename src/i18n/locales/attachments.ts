import type { LocaleNamespace } from '../types'

/** Comprobantes adjuntos a un pago (cifrados en la nube). */
export const attachments = {
  es: {
    'attachments.title': 'Papeles guardados',
    'attachments.empty': 'Todavía no guardaste ningún comprobante para este pago.',
    'attachments.add': 'Agregar un archivo',
    'attachments.working': 'Procesando…',
    'attachments.hint': 'PDF o imagen, hasta 25 MB. Se cifra antes de subirse.',
    'attachments.open': 'Abrir',
    'attachments.openNamed': 'Abrir {name}',
    'attachments.removeNamed': 'Borrar {name}',
    'attachments.demoUnavailable': 'Los archivos adjuntos no están disponibles en el modo demo.',
    'attachments.errors.uploadFailed': 'No se pudo guardar el archivo',
    'attachments.errors.openFailed': 'No se pudo abrir el archivo',
    'attachments.errors.removeFailed': 'No se pudo borrar el archivo',
    'attachments.errors.tooLarge': 'El archivo es muy grande (máximo 25 MB)',
    'attachments.errors.missing': 'No encontramos el archivo en la nube',
    'attachments.errors.corrupted': 'El archivo está dañado y no se puede abrir',
    'attachments.errors.notInCloud':
      'Este archivo quedó en la computadora donde se cargó y no está en la nube. Podés borrarlo y volver a subirlo.'
  },
  en: {
    'attachments.title': 'Saved documents',
    'attachments.empty': "You haven't saved any receipts for this payment yet.",
    'attachments.add': 'Add a file',
    'attachments.working': 'Working…',
    'attachments.hint': 'PDF or image, up to 25 MB. It is encrypted before uploading.',
    'attachments.open': 'Open',
    'attachments.openNamed': 'Open {name}',
    'attachments.removeNamed': 'Delete {name}',
    'attachments.demoUnavailable': 'Attachments are not available in demo mode.',
    'attachments.errors.uploadFailed': 'Could not save the file',
    'attachments.errors.openFailed': 'Could not open the file',
    'attachments.errors.removeFailed': 'Could not delete the file',
    'attachments.errors.tooLarge': 'The file is too large (25 MB max)',
    'attachments.errors.missing': "We couldn't find the file in the cloud",
    'attachments.errors.corrupted': 'The file is damaged and cannot be opened',
    'attachments.errors.notInCloud':
      'This file stayed on the computer where it was added and is not in the cloud. You can delete it and upload it again.'
  }
} satisfies LocaleNamespace

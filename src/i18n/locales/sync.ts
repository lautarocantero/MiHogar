import type { LocaleNamespace } from '../types'

/** Sincronización con la nube y errores del vault / de la conexión. */
export const sync = {
  es: {
    'sync.status.saving': 'Guardando…',
    'sync.status.saved': 'Guardado',
    'sync.status.offline': 'Sin conexión',
    'sync.status.error': 'No se pudo guardar',
    'sync.saveFailed': 'No se pudo guardar el último cambio. Lo volvemos a intentar.',
    'sync.remoteChangesLoaded': 'Se cargaron los cambios hechos desde otro dispositivo.',
    'sync.conflictReloaded':
      'Otro dispositivo guardó cambios al mismo tiempo: cargamos esa versión. Revisá tu último cambio.',
    'sync.keyChangedElsewhere':
      'La clave del hogar se cambió desde otro dispositivo. Ingresá la clave nueva.',
    'sync.status.pending': 'Sin guardar',
    'sync.status.conflict': 'Conflicto',
    'sync.vaultRepaired':
      'Había montos dañados en tus datos y los corregimos (quedaron en 0). Revisá tus cuentas y pagos.',
    'sync.conflict.title': 'Otro dispositivo guardó cambios',
    'sync.conflict.description':
      'Mientras editabas, se guardaron cambios desde otro dispositivo. Elegí con qué versión seguir. Si no estás seguro, descargá primero tu versión como respaldo.',
    'sync.conflict.keepLocal': 'Quedarme con mis cambios',
    'sync.conflict.useRemote': 'Usar los del otro dispositivo',
    'sync.conflict.exportLocal': 'Descargar mi versión',
    'sync.conflict.keepLocalFailed': 'No se pudieron guardar tus cambios. Volvé a intentar.',
    'sync.conflict.useRemoteFailed': 'No se pudo cargar la otra versión. Volvé a intentar.',
    'sync.unsaved.title': 'Tenés cambios sin guardar',
    'sync.unsaved.description':
      'Algunos cambios todavía no se subieron a la nube (sin conexión o la nube no responde). Si salís ahora, se pierden.',
    'sync.unsaved.sessionEndedDescription':
      'Tu sesión terminó y algunos cambios no llegaron a guardarse en la nube. Descargá un respaldo para no perderlos antes de salir.',
    'sync.unsaved.keyChangedDescription':
      'La clave del hogar se cambió desde otro dispositivo y algunos cambios tuyos no llegaron a guardarse. Descargá un respaldo para no perderlos antes de salir.',
    'sync.unsaved.retry': 'Reintentar',
    'sync.unsaved.retryFailed': 'Todavía no se pudo guardar. Revisá la conexión.',
    'sync.unsaved.export': 'Descargar respaldo',
    'sync.unsaved.exported': 'Descargamos el respaldo ({fileName}).',
    'sync.unsaved.exportFailed': 'No se pudo descargar el respaldo',
    'sync.unsaved.discard': 'Salir igual (descartar)',

    'vaultErrors.invalidData':
      'Hay datos inválidos (por ejemplo, un monto demasiado grande) y no se pueden guardar. Corregilos para seguir guardando.',
    'vaultErrors.amountTooLarge': 'El monto es demasiado grande',
    'vaultErrors.wrongHouseholdKey': 'La clave del hogar no es correcta',
    'vaultErrors.verifyKeyFailed': 'No se pudo verificar la clave del hogar',
    'vaultErrors.invalidKey': 'La clave del hogar no es correcta o el archivo está dañado',
    'vaultErrors.conflict': 'Otro dispositivo guardó cambios. Volvé a intentar.',
    'vaultErrors.notUnlocked': 'Los datos del hogar están bloqueados. Ingresá la clave de nuevo.',
    'vaultErrors.notFound': 'No encontramos los datos del hogar en tu cuenta',
    'vaultErrors.alreadyExists': 'Tu cuenta ya tiene datos del hogar',
    'vaultErrors.invalidBackup': 'Ese archivo no es un respaldo de Mi Hogar',
    'vaultErrors.corrupted': 'Los datos del hogar están dañados y no se pueden abrir',
    'vaultErrors.cryptoUnavailable':
      'Este navegador no permite cifrar los datos. Abrí Mi Hogar con https en un navegador actualizado.',

    'cloudErrors.notConfigured': 'La app no está conectada a la nube',
    'cloudErrors.notSignedIn': 'Tu sesión terminó. Volvé a entrar.',
    'cloudErrors.network': 'No hay conexión. Revisá internet y volvé a intentar.',
    'cloudErrors.generic': 'No pudimos comunicarnos con la nube. Volvé a intentar en un rato.',
    'cloudErrors.configTitle': 'Falta configurar la conexión',
    'cloudErrors.configDescription':
      'Esta copia de Mi Hogar no tiene configurado el servidor (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY). Mientras tanto podés probar la demo.',
    'cloudErrors.loadTitle': 'No pudimos cargar tus datos'
  },
  en: {
    'sync.status.saving': 'Saving…',
    'sync.status.saved': 'Saved',
    'sync.status.offline': 'Offline',
    'sync.status.error': 'Could not save',
    'sync.saveFailed': 'Your last change could not be saved. We will try again.',
    'sync.remoteChangesLoaded': 'Changes made on another device were loaded.',
    'sync.conflictReloaded':
      'Another device saved changes at the same time: we loaded that version. Please check your last change.',
    'sync.keyChangedElsewhere':
      'The household key was changed on another device. Enter the new key.',
    'sync.status.pending': 'Unsaved',
    'sync.status.conflict': 'Conflict',
    'sync.vaultRepaired':
      'Some amounts in your data were damaged and we fixed them (set to 0). Please review your accounts and payments.',
    'sync.conflict.title': 'Another device saved changes',
    'sync.conflict.description':
      'While you were editing, changes were saved from another device. Choose which version to keep. If unsure, download your version as a backup first.',
    'sync.conflict.keepLocal': 'Keep my changes',
    'sync.conflict.useRemote': "Use the other device's",
    'sync.conflict.exportLocal': 'Download my version',
    'sync.conflict.keepLocalFailed': 'Your changes could not be saved. Please try again.',
    'sync.conflict.useRemoteFailed': 'The other version could not be loaded. Please try again.',
    'sync.unsaved.title': 'You have unsaved changes',
    'sync.unsaved.description':
      'Some changes have not been uploaded to the cloud yet (offline or the cloud is not responding). If you leave now, they will be lost.',
    'sync.unsaved.sessionEndedDescription':
      'Your session ended and some changes were not saved to the cloud. Download a backup so you do not lose them before leaving.',
    'sync.unsaved.keyChangedDescription':
      'The household key was changed on another device and some of your changes were not saved. Download a backup so you do not lose them before leaving.',
    'sync.unsaved.retry': 'Retry',
    'sync.unsaved.retryFailed': 'It still could not be saved. Check your connection.',
    'sync.unsaved.export': 'Download backup',
    'sync.unsaved.exported': 'We downloaded the backup ({fileName}).',
    'sync.unsaved.exportFailed': 'Could not download the backup',
    'sync.unsaved.discard': 'Leave anyway (discard)',

    'vaultErrors.invalidData':
      'Some data is invalid (for example, an amount that is too large) and cannot be saved. Fix it to keep saving.',
    'vaultErrors.amountTooLarge': 'The amount is too large',
    'vaultErrors.wrongHouseholdKey': 'The household key is incorrect',
    'vaultErrors.verifyKeyFailed': 'Could not verify the household key',
    'vaultErrors.invalidKey': 'The household key is incorrect or the file is damaged',
    'vaultErrors.conflict': 'Another device saved changes. Please try again.',
    'vaultErrors.notUnlocked': 'The household data is locked. Enter the key again.',
    'vaultErrors.notFound': "We couldn't find household data in your account",
    'vaultErrors.alreadyExists': 'Your account already has household data',
    'vaultErrors.invalidBackup': 'That file is not a Mi Hogar backup',
    'vaultErrors.corrupted': 'The household data is damaged and cannot be opened',
    'vaultErrors.cryptoUnavailable':
      'This browser cannot encrypt data. Open Mi Hogar over https in an up-to-date browser.',

    'cloudErrors.notConfigured': 'The app is not connected to the cloud',
    'cloudErrors.notSignedIn': 'Your session ended. Please sign in again.',
    'cloudErrors.network': 'No connection. Check your internet and try again.',
    'cloudErrors.generic': "We couldn't reach the cloud. Please try again in a while.",
    'cloudErrors.configTitle': 'Connection not configured',
    'cloudErrors.configDescription':
      'This copy of Mi Hogar has no server configured (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Meanwhile you can try the demo.',
    'cloudErrors.loadTitle': "We couldn't load your data"
  }
} satisfies LocaleNamespace

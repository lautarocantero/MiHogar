import type { LocaleNamespace } from '../types'

/** Clave del hogar: crear, desbloquear, restaurar un respaldo, demo. */
export const onboarding = {
  es: {
    'onboarding.viewDemo': 'Ver demo',
    'onboarding.demoFailed': 'No se pudo iniciar la demo',
    'onboarding.switchLanguage': 'Cambiar el idioma a {language}',
    'onboarding.householdKeyLabel': 'Clave del hogar',
    'onboarding.confirmHouseholdKeyLabel': 'Repetí la clave',

    'onboarding.createKey.title': 'Creá la clave del hogar',
    'onboarding.createKey.stepTitle': 'La clave del hogar',
    'onboarding.createKey.stepSubtitle': 'Cifra tus datos en este dispositivo antes de subirlos',
    'onboarding.createKey.description':
      'Es una sola, para todo el hogar, y la vas a usar en cada dispositivo. Guardala en un lugar seguro: si la olvidás, nadie puede recuperar la información.',
    'onboarding.createKey.submit': 'Crear la clave y empezar',
    'onboarding.createKey.submitting': 'Creando…',
    'onboarding.createFailed': 'No se pudieron crear los datos del hogar',

    'onboarding.unlock.title': 'Ingresá la clave del hogar',
    'onboarding.unlock.description':
      'Es la misma clave para todo: abrir los datos del hogar y ver los datos guardados de cada pago.',
    'onboarding.unlock.submit': 'Entrar',
    'onboarding.unlock.submitting': 'Abriendo…',

    'onboarding.restore.title': '¿Ya tenés un respaldo?',
    'onboarding.restore.description':
      'Si exportaste tus datos antes (archivo .dat de Mi Hogar), podés subirlos a tu cuenta en lugar de empezar de cero.',
    'onboarding.restore.pick': 'Importar un respaldo (.dat)',
    'onboarding.restore.dialogTitle': 'Clave del respaldo',
    'onboarding.restore.dialogDescription':
      'Ingresá la clave del hogar con la que se creó este respaldo. Va a ser la clave del hogar de tu cuenta.',
    'onboarding.restore.submit': 'Importar',
    'onboarding.restoring': 'Importando…',
    'onboarding.restoreFailed': 'No se pudo importar el respaldo',

    'onboarding.validation.householdKeyRequired': 'Ingresá la clave del hogar',
    'onboarding.validation.householdKeyTooShort': 'La clave debe tener al menos 8 caracteres',
    'onboarding.validation.householdKeysDontMatch': 'Las claves no coinciden'
  },
  en: {
    'onboarding.viewDemo': 'View demo',
    'onboarding.demoFailed': 'Could not start the demo',
    'onboarding.switchLanguage': 'Switch language to {language}',
    'onboarding.householdKeyLabel': 'Household key',
    'onboarding.confirmHouseholdKeyLabel': 'Repeat the key',

    'onboarding.createKey.title': 'Create the household key',
    'onboarding.createKey.stepTitle': 'The household key',
    'onboarding.createKey.stepSubtitle': 'Encrypts your data on this device before uploading it',
    'onboarding.createKey.description':
      'There is one for the whole household, and you will use it on every device. Keep it somewhere safe: if you forget it, nobody can recover the information.',
    'onboarding.createKey.submit': 'Create the key and start',
    'onboarding.createKey.submitting': 'Creating…',
    'onboarding.createFailed': 'Could not create the household data',

    'onboarding.unlock.title': 'Enter the household key',
    'onboarding.unlock.description':
      'It is the same key for everything: opening the household data and viewing the saved details of each payment.',
    'onboarding.unlock.submit': 'Open',
    'onboarding.unlock.submitting': 'Opening…',

    'onboarding.restore.title': 'Already have a backup?',
    'onboarding.restore.description':
      'If you exported your data before (a Mi Hogar .dat file), you can upload it to your account instead of starting from scratch.',
    'onboarding.restore.pick': 'Import a backup (.dat)',
    'onboarding.restore.dialogTitle': 'Backup key',
    'onboarding.restore.dialogDescription':
      'Enter the household key this backup was created with. It will become your account’s household key.',
    'onboarding.restore.submit': 'Import',
    'onboarding.restoring': 'Importing…',
    'onboarding.restoreFailed': 'Could not import the backup',

    'onboarding.validation.householdKeyRequired': 'Enter the household key',
    'onboarding.validation.householdKeyTooShort': 'The key must be at least 8 characters long',
    'onboarding.validation.householdKeysDontMatch': "The keys don't match"
  }
} satisfies LocaleNamespace

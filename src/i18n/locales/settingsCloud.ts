import type { LocaleNamespace } from '../types'

/** Configuración: cuenta y respaldo (.dat) en la versión con nube. */
export const settingsCloud = {
  es: {
    'settingsCloud.account.title': 'Tu cuenta',
    'settingsCloud.account.emailLabel': 'Email',
    'settingsCloud.account.description':
      'Al cerrar la sesión, este dispositivo olvida la clave del hogar. Tus datos siguen guardados y cifrados en la nube.',

    'settingsCloud.backup.title': 'Respaldo de tus datos',
    'settingsCloud.backup.description':
      'Descargá una copia cifrada de tus datos (archivo .dat, se abre con la clave del hogar), o reemplazá los datos de tu cuenta por un respaldo guardado antes.',
    'settingsCloud.backup.export': 'Descargar un respaldo',
    'settingsCloud.backup.import': 'Importar un respaldo',
    'settingsCloud.backup.exported':
      'Descargamos el respaldo ({fileName}). Guardalo en un lugar seguro.',
    'settingsCloud.backup.exportFailed': 'No se pudo descargar el respaldo',
    'settingsCloud.backup.imported':
      'Importamos el respaldo. Desde ahora la clave del hogar es la de ese respaldo.',
    'settingsCloud.backup.confirmTitle': '¿Reemplazar tus datos?',
    'settingsCloud.backup.confirmWarning':
      'Todos los datos actuales de tu cuenta se van a reemplazar por los del respaldo, en todos tus dispositivos.',
    'settingsCloud.backup.confirmDescription':
      'Te recomendamos descargar primero un respaldo de lo que tenés ahora. Después vas a elegir el archivo y escribir su clave del hogar.',
    'settingsCloud.backup.confirmSubmit': 'Elegir el respaldo',
    'settingsCloud.backup.keyPromptDescription':
      'Ingresá la clave del hogar con la que se creó este respaldo. Recién cuando la clave sea correcta se reemplazan tus datos.',
    'settingsCloud.backup.replaceSubmit': 'Reemplazar mis datos'
  },
  en: {
    'settingsCloud.account.title': 'Your account',
    'settingsCloud.account.emailLabel': 'Email',
    'settingsCloud.account.description':
      'When you sign out, this device forgets the household key. Your data stays saved and encrypted in the cloud.',

    'settingsCloud.backup.title': 'Back up your data',
    'settingsCloud.backup.description':
      'Download an encrypted copy of your data (a .dat file, opened with the household key), or replace your account data with a backup you saved before.',
    'settingsCloud.backup.export': 'Download a backup',
    'settingsCloud.backup.import': 'Import a backup',
    'settingsCloud.backup.exported':
      'We downloaded the backup ({fileName}). Keep it somewhere safe.',
    'settingsCloud.backup.exportFailed': 'Could not download the backup',
    'settingsCloud.backup.imported':
      'We imported the backup. From now on the household key is the one from that backup.',
    'settingsCloud.backup.confirmTitle': 'Replace your data?',
    'settingsCloud.backup.confirmWarning':
      'All the current data in your account will be replaced with the backup, on all your devices.',
    'settingsCloud.backup.confirmDescription':
      'We recommend downloading a backup of what you have now first. Then you will pick the file and enter its household key.',
    'settingsCloud.backup.confirmSubmit': 'Choose the backup',
    'settingsCloud.backup.keyPromptDescription':
      'Enter the household key this backup was created with. Your data is only replaced once the key is correct.',
    'settingsCloud.backup.replaceSubmit': 'Replace my data'
  }
} satisfies LocaleNamespace

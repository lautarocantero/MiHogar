import type { LocaleNamespace } from '../types'

/** Pantalla de Configuración (tarjetas locales: idioma, letra, fecha, integrantes, clave, reinicio). */
export const settings = {
  es: {
    'settings.pageLabel': 'Configuración',
    'settings.demoNotice':
      'La clave del hogar, el respaldo y el reinicio de fábrica no están disponibles en el modo demo.',

    'settings.language.title': 'Idioma',
    'settings.language.description': 'Elegí en qué idioma se muestra la aplicación.',

    'settings.fontSize.title': 'Tamaño de la letra',
    'settings.fontSize.xsmall': 'Muy chica (-20%)',
    'settings.fontSize.small': 'Chica (-10%)',
    'settings.fontSize.normal': 'Normal',
    'settings.fontSize.large': 'Grande (+15%)',
    'settings.fontSize.xlarge': 'Muy grande (+30%)',
    'settings.fontSize.loadFailed': 'No se pudo cargar el tamaño de letra guardado',
    'settings.fontSize.saveFailed': 'No se pudo guardar el tamaño de letra',

    'settings.dateFormat.title': 'Formato de fecha',
    'settings.dateFormat.dmy': 'Día/Mes/Año (31/12/2026)',
    'settings.dateFormat.mdy': 'Mes/Día/Año (12/31/2026)',
    'settings.dateFormat.loadFailed': 'No se pudo cargar el formato de fecha guardado',
    'settings.dateFormat.saveFailed': 'No se pudo guardar el formato de fecha',

    'settings.members.title': 'Quiénes usan la app',
    'settings.members.add': 'Agregar',
    'settings.members.empty': 'Todavía no agregaste a nadie.',
    'settings.members.dialogTitle': 'Agregar quién usa la app',
    'settings.members.nameLabel': 'Nombre',
    'settings.members.addFailed': 'No se pudo agregar el integrante',

    'settings.householdKey.description':
      'Esta clave protege todos los datos guardados. Cambiarla no borra nada, solo actualiza con qué contraseña se abre la aplicación.',
    'settings.householdKey.current': 'Clave actual',
    'settings.householdKey.new': 'Clave nueva',
    'settings.householdKey.confirm': 'Repetila',
    'settings.householdKey.submit': 'Guardar la clave',
    'settings.householdKey.changeFailed': 'No se pudo cambiar la clave del hogar',
    'settings.householdKey.changed': 'Guardamos la nueva clave del hogar.',

    'settings.danger.title': 'Zona de riesgo',
    'settings.danger.description':
      'Borrá tus datos y volvé a empezar de cero. Te va a preguntar qué querés eliminar.',
    'settings.factoryReset.title': 'Volver a estado de fábrica',
    'settings.factoryReset.warning':
      'Esto no se puede deshacer. Elegí qué querés borrar — si dejás algo que otra sección todavía usa (por ejemplo cuentas de movimientos que sí borrás), esos registros van a quedar sin esa referencia.',
    'settings.factoryReset.selectAll': 'Seleccionar todo (reinicio completo)',
    'settings.factoryReset.submit': 'Eliminar lo seleccionado',
    'settings.factoryReset.failed': 'No se pudo reiniciar la aplicación',
    'settings.factoryReset.accounts': 'Cuentas y tarjetas',
    'settings.factoryReset.movements': 'Movimientos (gastos e ingresos)',
    'settings.factoryReset.payments': 'Pagos y servicios',
    'settings.factoryReset.savings': 'Ahorros e inversiones',
    'settings.factoryReset.members': 'Integrantes del hogar',
    'settings.factoryReset.categories': 'Categorías (vuelven a las de fábrica)',
    'settings.factoryReset.householdName': 'Nombre del hogar'
  },
  en: {
    'settings.pageLabel': 'Settings',
    'settings.demoNotice':
      'The household key, backups and factory reset are not available in demo mode.',

    'settings.language.title': 'Language',
    'settings.language.description': 'Choose the language the app is shown in.',

    'settings.fontSize.title': 'Text size',
    'settings.fontSize.xsmall': 'Extra small (-20%)',
    'settings.fontSize.small': 'Small (-10%)',
    'settings.fontSize.normal': 'Normal',
    'settings.fontSize.large': 'Large (+15%)',
    'settings.fontSize.xlarge': 'Extra large (+30%)',
    'settings.fontSize.loadFailed': 'Could not load the saved text size',
    'settings.fontSize.saveFailed': 'Could not save the text size',

    'settings.dateFormat.title': 'Date format',
    'settings.dateFormat.dmy': 'Day/Month/Year (31/12/2026)',
    'settings.dateFormat.mdy': 'Month/Day/Year (12/31/2026)',
    'settings.dateFormat.loadFailed': 'Could not load the saved date format',
    'settings.dateFormat.saveFailed': 'Could not save the date format',

    'settings.members.title': 'Who uses the app',
    'settings.members.add': 'Add',
    'settings.members.empty': "You haven't added anyone yet.",
    'settings.members.dialogTitle': 'Add someone who uses the app',
    'settings.members.nameLabel': 'Name',
    'settings.members.addFailed': 'Could not add the member',

    'settings.householdKey.description':
      "This key protects all your saved data. Changing it doesn't delete anything, it only updates the password that opens the app.",
    'settings.householdKey.current': 'Current key',
    'settings.householdKey.new': 'New key',
    'settings.householdKey.confirm': 'Repeat it',
    'settings.householdKey.submit': 'Save the key',
    'settings.householdKey.changeFailed': 'Could not change the household key',
    'settings.householdKey.changed': 'We saved the new household key.',

    'settings.danger.title': 'Danger zone',
    'settings.danger.description':
      "Delete your data and start over from scratch. You'll be asked what you want to delete.",
    'settings.factoryReset.title': 'Reset to factory settings',
    'settings.factoryReset.warning':
      "This can't be undone. Choose what you want to delete — if you keep something another section still uses (for example accounts used by movements you do delete), those records will lose that reference.",
    'settings.factoryReset.selectAll': 'Select all (full reset)',
    'settings.factoryReset.submit': 'Delete selected',
    'settings.factoryReset.failed': 'Could not reset the app',
    'settings.factoryReset.accounts': 'Accounts and cards',
    'settings.factoryReset.movements': 'Movements (expenses and income)',
    'settings.factoryReset.payments': 'Payments and bills',
    'settings.factoryReset.savings': 'Savings and investments',
    'settings.factoryReset.members': 'Household members',
    'settings.factoryReset.categories': 'Categories (back to the defaults)',
    'settings.factoryReset.householdName': 'Household name'
  }
} satisfies LocaleNamespace

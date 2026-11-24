import type { LocaleNamespace } from '../types'

/** Recordatorios de pago (notificaciones del navegador). */
export const reminders = {
  es: {
    'reminders.title': 'Recordatorios de pago',
    'reminders.description':
      'Te avisamos con una notificación de este dispositivo, con la anticipación que elijas.',
    'reminders.toggleLabel': 'Activar recordatorios de pago',
    'reminders.enabled': 'Activados',
    'reminders.disabled': 'Desactivados',
    'reminders.leadDaysLabel': 'Avisar con',
    'reminders.leadDays.sameDay': 'El mismo día',
    'reminders.leadDays.oneDay': '1 día antes',
    'reminders.leadDays.threeDays': '3 días antes',
    'reminders.leadDays.oneWeek': '1 semana antes',
    'reminders.permission.needed': 'Para avisarte, el navegador tiene que permitir notificaciones.',
    'reminders.permission.allow': 'Permitir',
    'reminders.permission.denied':
      'Las notificaciones están bloqueadas para Mi Hogar. Habilitalas desde la configuración del navegador.',
    'reminders.permission.unsupported': 'Este navegador no permite notificaciones.',
    'reminders.loadFailed': 'No se pudo cargar la preferencia de recordatorios',
    'reminders.saveFailed': 'No se pudo guardar la preferencia de recordatorios',
    'reminders.checkFailed': 'No se pudieron revisar los recordatorios de pago',
    'reminders.notificationTitle': 'Recordatorio: {concept}',
    'reminders.notificationBody': 'Vence el {dueDate} · {amount}'
  },
  en: {
    'reminders.title': 'Payment reminders',
    'reminders.description': 'We notify you on this device, as far in advance as you choose.',
    'reminders.toggleLabel': 'Turn on payment reminders',
    'reminders.enabled': 'On',
    'reminders.disabled': 'Off',
    'reminders.leadDaysLabel': 'Notify me',
    'reminders.leadDays.sameDay': 'The same day',
    'reminders.leadDays.oneDay': '1 day before',
    'reminders.leadDays.threeDays': '3 days before',
    'reminders.leadDays.oneWeek': '1 week before',
    'reminders.permission.needed': 'To notify you, the browser needs to allow notifications.',
    'reminders.permission.allow': 'Allow',
    'reminders.permission.denied':
      'Notifications are blocked for Mi Hogar. Enable them in your browser settings.',
    'reminders.permission.unsupported': 'This browser does not support notifications.',
    'reminders.loadFailed': 'Could not load the reminder preference',
    'reminders.saveFailed': 'Could not save the reminder preference',
    'reminders.checkFailed': 'Could not check the payment reminders',
    'reminders.notificationTitle': 'Reminder: {concept}',
    'reminders.notificationBody': 'Due {dueDate} · {amount}'
  }
} satisfies LocaleNamespace

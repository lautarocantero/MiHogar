import type { LocaleNamespace } from '../types'

/** Campana de notificaciones del header. */
export const notifications = {
  es: {
    'notifications.title': 'Notificaciones',
    'notifications.empty': 'No tenés notificaciones pendientes.',
    'notifications.missingDeposit': 'Todavía no cargaste este depósito variable',
    'notifications.markRead': 'Marcar como vista',
    'notifications.markReadItem': 'Marcar {name} como vista',
    'notifications.goTo': 'Ir a la notificación',
    'notifications.goToItem': 'Ir a {name}'
  },
  en: {
    'notifications.title': 'Notifications',
    'notifications.empty': 'You have no pending notifications.',
    'notifications.missingDeposit': "You haven't entered this variable deposit yet",
    'notifications.markRead': 'Mark as seen',
    'notifications.markReadItem': 'Mark {name} as seen',
    'notifications.goTo': 'Go to notification',
    'notifications.goToItem': 'Go to {name}'
  }
} satisfies LocaleNamespace

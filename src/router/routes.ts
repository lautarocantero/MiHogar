export const ROUTES = {
  HOME: '/',
  CALENDAR: '/calendario',
  TIMELINE: '/linea-de-tiempo',
  PAYMENTS: '/pagos',
  PAYMENT_DETAIL: '/pagos/:paymentId',
  ACCOUNTS: '/cuentas',
  PROJECTION: '/proyeccion',
  SAVINGS: '/ahorros',
  REPORTS: '/informes',
  SETTINGS: '/ajustes'
} as const

export function buildPaymentDetailPath(paymentId: string): string {
  return `/pagos/${paymentId}`
}

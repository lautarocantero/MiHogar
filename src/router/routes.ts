export const ROUTES = {
  HOME: '/',
  CALENDAR: '/calendario',
  PAYMENTS: '/pagos',
  PAYMENT_DETAIL: '/pagos/:paymentId',
  ACCOUNTS: '/cuentas',
  PROJECTION: '/proyeccion',
  SAVINGS: '/ahorros',
  DEBTS: '/deudas-y-prestamos',
  REPORTS: '/informes',
  SETTINGS: '/ajustes'
} as const

export function buildPaymentDetailPath(paymentId: string): string {
  return `/pagos/${paymentId}`
}

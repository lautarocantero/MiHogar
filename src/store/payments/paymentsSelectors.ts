import type { RootState } from '@/store'
import type { Payment } from '@/typings/domain/types'
import { PaymentStatus } from '@/typings/domain/enums'
import { paymentsSelectors } from './paymentsSlice'

export const selectAllPayments = (state: RootState): Payment[] =>
  paymentsSelectors.selectAll(state.payments)

export const selectPaymentById = (state: RootState, paymentId: string): Payment | undefined =>
  paymentsSelectors.selectById(state.payments, paymentId)

export const selectPendingPayments = (state: RootState): Payment[] =>
  paymentsSelectors
    .selectAll(state.payments)
    .filter((payment) => payment.status === PaymentStatus.PENDING)

export const selectPaidPayments = (state: RootState): Payment[] =>
  paymentsSelectors
    .selectAll(state.payments)
    .filter((payment) => payment.status === PaymentStatus.PAID)

export const selectPaymentsByAccountId = (state: RootState, accountId: string): Payment[] =>
  paymentsSelectors.selectAll(state.payments).filter((payment) => payment.accountId === accountId)

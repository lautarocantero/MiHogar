import { createAsyncThunk } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { RootState, AppDispatch } from '@/store'
import type { Movement } from '@/typings/domain/types'
import { AccountType, MovementType, PaymentStatus } from '@/typings/domain/enums'
import { addMovement, movementsSelectors, removeMovement, updateMovement } from './movementsSlice'
import { accountsSelectors, updateAccount } from '@/store/accounts/accountsSlice'
import { paymentsSelectors, updatePayment } from '@/store/payments/paymentsSlice'
import { selectCardPaymentsToSettle } from '@/utils/domain/selectCardPaymentsToSettle'

const thunkTypes = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()

export type RecordMovementInput = Omit<Movement, 'id'>
export type UpdateMovementInput = { id: string; changes: Omit<Movement, 'id'> }

function isTodayOrPast(isoDate: string): boolean {
  const todayIsoDate = new Date().toISOString().slice(0, 10)
  return isoDate <= todayIsoDate
}

function applyMovementBalanceEffect(
  dispatch: AppDispatch,
  getState: () => RootState,
  movement: Movement,
  sign: 1 | -1
): void {
  const state = getState()
  const linkedAccount = accountsSelectors.selectById(state.accounts, movement.accountId)

  if (movement.type === MovementType.CARD_PAYMENT) {
    if (linkedAccount) {
      const nextUsedAmount = Math.max((linkedAccount.usedAmount ?? 0) - movement.amount * sign, 0)
      dispatch(updateAccount({ ...linkedAccount, usedAmount: nextUsedAmount }))
    }
    if (movement.toAccountId) {
      const sourceAccount = accountsSelectors.selectById(state.accounts, movement.toAccountId)
      if (sourceAccount) {
        dispatch(
          updateAccount({
            ...sourceAccount,
            balance: sourceAccount.balance - movement.amount * sign
          })
        )
      }
    }
    return
  }

  if (linkedAccount?.type === AccountType.CREDIT_CARD) {
    const usedDelta = movement.type === MovementType.INCOME ? -movement.amount : movement.amount
    const nextUsedAmount = Math.max((linkedAccount.usedAmount ?? 0) + usedDelta * sign, 0)
    dispatch(updateAccount({ ...linkedAccount, usedAmount: nextUsedAmount }))
  } else if (linkedAccount) {
    const baseDelta = movement.type === MovementType.INCOME ? movement.amount : -movement.amount
    dispatch(updateAccount({ ...linkedAccount, balance: linkedAccount.balance + baseDelta * sign }))
  }

  if (movement.type === MovementType.TRANSFER && movement.toAccountId) {
    const destinationAccount = accountsSelectors.selectById(state.accounts, movement.toAccountId)
    if (destinationAccount) {
      dispatch(
        updateAccount({
          ...destinationAccount,
          balance: destinationAccount.balance + movement.amount * sign
        })
      )
    }
  }
}

/**
 * Marca como pagados los pagos pendientes de la tarjeta que cubre `cardPayment` (por orden de
 * fecha, mientras alcance el monto) y registra cada uno como consumo de la tarjeta en su fecha,
 * igual que si se hubiera marcado como pagado a mano.
 */
function settleCardPayments(
  dispatch: AppDispatch,
  getState: () => RootState,
  cardPayment: Movement
): void {
  const card = accountsSelectors.selectById(getState().accounts, cardPayment.accountId)
  if (card?.type !== AccountType.CREDIT_CARD) {
    return
  }
  const paymentsToSettle = selectCardPaymentsToSettle(
    paymentsSelectors.selectAll(getState().payments),
    card,
    cardPayment.amount,
    cardPayment.date
  )

  for (const payment of paymentsToSettle) {
    dispatch(
      updatePayment({
        ...payment,
        status: PaymentStatus.PAID,
        installmentsPaid:
          typeof payment.installmentsTotal === 'number'
            ? Math.min((payment.installmentsPaid ?? 0) + 1, payment.installmentsTotal)
            : payment.installmentsPaid
      })
    )
    const charge: Movement = {
      id: uuidv4(),
      type: MovementType.EXPENSE,
      amount: payment.amount,
      date: payment.dueDate,
      accountId: card.id,
      categoryId: payment.categoryId,
      ownerType: payment.ownerType,
      ownerId: payment.ownerId,
      paymentId: payment.id,
      note: payment.concept
    }
    dispatch(addMovement(charge))
    applyMovementBalanceEffect(dispatch, getState, charge, 1)
  }
}

export const recordMovementThunk = thunkTypes(
  'movements/record',
  (input: RecordMovementInput, { dispatch, getState }) => {
    const movement: Movement = { ...input, id: uuidv4() }

    // Pagar la tarjeta salda sus pagos pendientes del resumen. Sus consumos se cargan antes que
    // el pago para que el monto usado no quede recortado en 0 y vuelva a subir.
    if (movement.type === MovementType.CARD_PAYMENT && isTodayOrPast(movement.date)) {
      settleCardPayments(dispatch, getState, movement)
    }

    dispatch(addMovement(movement))

    if (isTodayOrPast(movement.date)) {
      applyMovementBalanceEffect(dispatch, getState, movement, 1)
    }

    return movement
  }
)

export const updateMovementThunk = thunkTypes(
  'movements/update',
  (input: UpdateMovementInput, { dispatch, getState }) => {
    const oldMovement = movementsSelectors.selectById(getState().movements, input.id)
    if (!oldMovement) {
      throw new Error('No se encontró el movimiento a editar')
    }

    if (!oldMovement.isImported && isTodayOrPast(oldMovement.date)) {
      applyMovementBalanceEffect(dispatch, getState, oldMovement, -1)
    }

    // isImported se fuerza desde oldMovement, no desde input.changes: los hooks que llaman a
    // este thunk arman `changes` campo por campo y pueden no reenviarlo (spec Supuesto 12).
    const newMovement: Movement = {
      ...input.changes,
      id: input.id,
      isImported: oldMovement.isImported
    }
    dispatch(updateMovement(newMovement))

    if (!newMovement.isImported && isTodayOrPast(newMovement.date)) {
      applyMovementBalanceEffect(dispatch, getState, newMovement, 1)
    }

    return newMovement
  }
)

export const removeMovementThunk = thunkTypes(
  'movements/remove',
  (movementId: string, { dispatch, getState }) => {
    const movement = movementsSelectors.selectById(getState().movements, movementId)
    if (movement && !movement.isImported && isTodayOrPast(movement.date)) {
      applyMovementBalanceEffect(dispatch, getState, movement, -1)
    }
    dispatch(removeMovement(movementId))
  }
)

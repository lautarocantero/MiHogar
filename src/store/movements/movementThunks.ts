import { createAsyncThunk } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { RootState, AppDispatch } from '@/store'
import type { Movement } from '@/typings/domain/types'
import { AccountType, MovementType } from '@/typings/domain/enums'
import { addMovement, movementsSelectors, removeMovement, updateMovement } from './movementsSlice'
import { accountsSelectors, updateAccount } from '@/store/accounts/accountsSlice'

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

export const recordMovementThunk = thunkTypes(
  'movements/record',
  (input: RecordMovementInput, { dispatch, getState }) => {
    const movement: Movement = { ...input, id: uuidv4() }
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

    if (isTodayOrPast(oldMovement.date)) {
      applyMovementBalanceEffect(dispatch, getState, oldMovement, -1)
    }

    const newMovement: Movement = { ...input.changes, id: input.id }
    dispatch(updateMovement(newMovement))

    if (isTodayOrPast(newMovement.date)) {
      applyMovementBalanceEffect(dispatch, getState, newMovement, 1)
    }

    return newMovement
  }
)

export const removeMovementThunk = thunkTypes(
  'movements/remove',
  (movementId: string, { dispatch, getState }) => {
    const movement = movementsSelectors.selectById(getState().movements, movementId)
    if (movement && isTodayOrPast(movement.date)) {
      applyMovementBalanceEffect(dispatch, getState, movement, -1)
    }
    dispatch(removeMovement(movementId))
  }
)

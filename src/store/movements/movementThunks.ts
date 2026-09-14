import { createAsyncThunk } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { RootState, AppDispatch } from '@/store'
import type { Movement } from '@/typings/domain/types'
import { MovementType } from '@/typings/domain/enums'
import { addMovement } from './movementsSlice'
import { accountsSelectors, updateAccount } from '@/store/accounts/accountsSlice'

const thunkTypes = createAsyncThunk.withTypes<{ state: RootState; dispatch: AppDispatch }>()

export type RecordMovementInput = Omit<Movement, 'id'>

function isTodayOrPast(isoDate: string): boolean {
  const todayIsoDate = new Date().toISOString().slice(0, 10)
  return isoDate <= todayIsoDate
}

export const recordMovementThunk = thunkTypes(
  'movements/record',
  (input: RecordMovementInput, { dispatch, getState }) => {
    const movement: Movement = { ...input, id: uuidv4() }
    dispatch(addMovement(movement))

    if (!isTodayOrPast(movement.date)) {
      return movement
    }

    const state = getState()
    const sourceAccount = accountsSelectors.selectById(state.accounts, movement.accountId)
    if (sourceAccount) {
      const delta = movement.type === MovementType.INCOME ? movement.amount : -movement.amount
      dispatch(updateAccount({ ...sourceAccount, balance: sourceAccount.balance + delta }))
    }

    if (movement.type === MovementType.TRANSFER && movement.toAccountId) {
      const destinationAccount = accountsSelectors.selectById(state.accounts, movement.toAccountId)
      if (destinationAccount) {
        dispatch(
          updateAccount({
            ...destinationAccount,
            balance: destinationAccount.balance + movement.amount
          })
        )
      }
    }

    return movement
  }
)

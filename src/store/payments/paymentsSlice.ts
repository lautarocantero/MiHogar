import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Payment } from '@/typings/domain/types'

const paymentsAdapter = createEntityAdapter<Payment>()

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: paymentsAdapter.getInitialState(),
  reducers: {
    hydratePayments: paymentsAdapter.setAll,
    addPayment: paymentsAdapter.addOne,
    updatePayment: (state, action: PayloadAction<Payment>) => {
      paymentsAdapter.upsertOne(state, action.payload)
    },
    removePayment: paymentsAdapter.removeOne
  }
})

export const { hydratePayments, addPayment, updatePayment, removePayment } = paymentsSlice.actions
export const paymentsReducer = paymentsSlice.reducer
export const paymentsSelectors = paymentsAdapter.getSelectors()

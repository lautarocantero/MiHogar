import { createSlice } from '@reduxjs/toolkit'
import { VaultStatus } from './typings/enums'
import type { VaultState } from './typings/types'
import {
  checkVaultExistsThunk,
  createVaultThunk,
  unlockVaultThunk,
  lockVaultThunk,
  importVaultBackupThunk,
  enterDemoModeThunk
} from './vaultThunks'

const initialState: VaultState = {
  status: VaultStatus.CHECKING,
  error: null
}

const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkVaultExistsThunk.fulfilled, (state, action) => {
        state.status = action.payload ? VaultStatus.LOCKED : VaultStatus.NOT_CREATED
      })
      .addCase(createVaultThunk.fulfilled, (state) => {
        state.status = VaultStatus.UNLOCKED
        state.error = null
      })
      .addCase(unlockVaultThunk.fulfilled, (state) => {
        state.status = VaultStatus.UNLOCKED
        state.error = null
      })
      .addCase(enterDemoModeThunk.fulfilled, (state) => {
        state.status = VaultStatus.DEMO
        state.error = null
      })
      .addCase(unlockVaultThunk.rejected, (state, action) => {
        state.error = action.error.message ?? 'La clave del hogar no es correcta'
      })
      .addCase(createVaultThunk.rejected, (state, action) => {
        state.error = action.error.message ?? 'No se pudo crear el archivo de datos'
      })
      .addCase(lockVaultThunk.fulfilled, (state) => {
        state.status = VaultStatus.LOCKED
      })
      .addCase(importVaultBackupThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = VaultStatus.LOCKED
        }
      })
  }
})

export const vaultReducer = vaultSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { VaultLockReason, VaultStatus } from './typings/enums'
import type { VaultState } from './typings/types'
import {
  checkVaultExistsThunk,
  createVaultThunk,
  unlockVaultThunk,
  restoreVaultThunk,
  lockVaultThunk,
  resetVaultThunk,
  reloadRemoteVaultThunk,
  closeAfterRemoteKeyChangeThunk,
  enterDemoModeThunk,
  exitDemoModeThunk
} from './vaultThunks'

const initialState: VaultState = {
  status: VaultStatus.CHECKING,
  error: null,
  lockReason: null
}

const vaultSlice = createSlice({
  name: 'vault',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkVaultExistsThunk.fulfilled, (state, action) => {
        // Si mientras tanto entró a la demo, no se lo saca.
        if (state.status === VaultStatus.DEMO) return
        state.error = null
        state.status = action.payload ? VaultStatus.LOCKED : VaultStatus.NOT_CREATED
      })
      .addCase(checkVaultExistsThunk.rejected, (state, action) => {
        if (state.status === VaultStatus.DEMO) return
        state.error = action.error.message ?? null
      })
      .addCase(createVaultThunk.fulfilled, (state) => {
        state.status = VaultStatus.UNLOCKED
        state.error = null
        state.lockReason = null
      })
      .addCase(unlockVaultThunk.fulfilled, (state) => {
        state.status = VaultStatus.UNLOCKED
        state.error = null
        state.lockReason = null
      })
      .addCase(restoreVaultThunk.fulfilled, (state) => {
        state.status = VaultStatus.UNLOCKED
        state.error = null
        state.lockReason = null
      })
      .addCase(enterDemoModeThunk.fulfilled, (state) => {
        state.status = VaultStatus.DEMO
        state.error = null
      })
      .addCase(exitDemoModeThunk.fulfilled, (state, action) => {
        state.error = null
        if (action.payload === null) {
          state.status = VaultStatus.CHECKING
        } else {
          state.status = action.payload ? VaultStatus.LOCKED : VaultStatus.NOT_CREATED
        }
      })
      .addCase(lockVaultThunk.fulfilled, (state, action) => {
        // `blocked`: había cambios sin guardar y se abrió el diálogo; sigue desbloqueado.
        if (action.payload !== 'locked') return
        state.status = VaultStatus.LOCKED
        state.lockReason = null
      })
      .addCase(closeAfterRemoteKeyChangeThunk.fulfilled, (state) => {
        state.status = VaultStatus.LOCKED
        state.lockReason = VaultLockReason.KEY_CHANGED
      })
      .addCase(resetVaultThunk.fulfilled, (state) => {
        if (state.status === VaultStatus.DEMO) return
        state.status = VaultStatus.CHECKING
        state.error = null
        state.lockReason = null
      })
      .addCase(reloadRemoteVaultThunk.fulfilled, (state, action) => {
        if (action.payload === 'locked') {
          state.status = VaultStatus.LOCKED
          state.lockReason = VaultLockReason.KEY_CHANGED
        }
      })
  }
})

export const vaultReducer = vaultSlice.reducer

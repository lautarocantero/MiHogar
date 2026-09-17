import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ReadNotification } from '@/typings/domain/types'

const notificationsAdapter = createEntityAdapter<ReadNotification>()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    hydrateReadNotifications: notificationsAdapter.setAll,
    markNotificationRead: (state, action: PayloadAction<string>) => {
      notificationsAdapter.addOne(state, { id: action.payload })
    }
  }
})

export const { hydrateReadNotifications, markNotificationRead } = notificationsSlice.actions
export const notificationsReducer = notificationsSlice.reducer
export const notificationsSelectors = notificationsAdapter.getSelectors()

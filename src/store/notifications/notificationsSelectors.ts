import type { RootState } from '@/store'
import { notificationsSelectors as notificationsEntitySelectors } from './notificationsSlice'

export const selectIsNotificationRead = (state: RootState, id: string): boolean =>
  Boolean(notificationsEntitySelectors.selectById(state.notifications, id))

import { useMemo, useState } from 'react'
import {
  Badge,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
  Typography
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Link as RouterLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectPendingPayments } from '@/store/payments/paymentsSelectors'
import { markNotificationRead } from '@/store/notifications/notificationsSlice'
import { selectIsNotificationRead } from '@/store/notifications/notificationsSelectors'
import { computeDueReminders } from '@/utils/domain/computeDueReminders'
import { computeMissingVariableDeposits } from '@/utils/domain/computeMissingVariableDeposits'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { buildPaymentDetailPath } from '@/router/routes'
import { useReminderPreference } from '@/modules/settings/useReminderPreference'
import { organicColors } from '@/theme/tokens'
import type { RootState } from '@/store'

export function NotificationsBell(): React.JSX.Element {
  const dispatch = useAppDispatch()
  const pendingPayments = useAppSelector(selectPendingPayments)
  const { leadDays } = useReminderPreference()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const dueSoon = useMemo(
    () => computeDueReminders(pendingPayments, leadDays),
    [pendingPayments, leadDays]
  )
  const missingDeposits = useMemo(
    () => computeMissingVariableDeposits(pendingPayments),
    [pendingPayments]
  )

  const dueSoonItems = dueSoon.map((reminder) => ({
    id: `${reminder.paymentId}:due`,
    paymentId: reminder.paymentId,
    primary: reminder.concept,
    secondary: formatDueLabel(reminder.dueDate)
  }))
  const missingDepositItems = missingDeposits.map((payment) => ({
    id: `${payment.id}:missingDeposit`,
    paymentId: payment.id,
    primary: payment.concept,
    secondary: 'Todavía no cargaste este depósito variable'
  }))
  const allItems = [...dueSoonItems, ...missingDepositItems]

  const readIds = useAppSelector((state: RootState) =>
    allItems.filter((item) => selectIsNotificationRead(state, item.id)).map((item) => item.id)
  )
  const unreadCount = allItems.filter((item) => !readIds.includes(item.id)).length

  return (
    <>
      <IconButton
        aria-label="Notificaciones"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ color: organicColors.orange.dark }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { width: 320, maxHeight: 420 } } }}
      >
        {allItems.length === 0 ? (
          <Box p={2}>
            <Typography variant="body2" color="text.secondary">
              No tenés notificaciones pendientes.
            </Typography>
          </Box>
        ) : (
          <List dense>
            {allItems.map((item) => {
              const isRead = readIds.includes(item.id)
              return (
                <ListItemButton
                  key={item.id}
                  component={RouterLink}
                  to={buildPaymentDetailPath(item.paymentId)}
                  onClick={() => setAnchor(null)}
                  sx={{ opacity: isRead ? 0.5 : 1 }}
                >
                  <ListItemText primary={item.primary} secondary={item.secondary} />
                  {!isRead && (
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <Tooltip title="Marcar como vista">
                        <IconButton
                          size="small"
                          edge="end"
                          aria-label={`Marcar ${item.primary} como vista`}
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            dispatch(markNotificationRead(item.id))
                          }}
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemIcon>
                  )}
                </ListItemButton>
              )
            })}
          </List>
        )}
      </Menu>
    </>
  )
}

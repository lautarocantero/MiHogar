import { useMemo, useState } from 'react'
import {
  Badge,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  Typography
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Link as RouterLink } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectPendingPayments } from '@/store/payments/paymentsSelectors'
import { computeDueReminders } from '@/utils/domain/computeDueReminders'
import { computeMissingVariableDeposits } from '@/utils/domain/computeMissingVariableDeposits'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { buildPaymentDetailPath } from '@/router/routes'
import { useReminderPreference } from '@/modules/settings/useReminderPreference'
import { organicColors } from '@/theme/tokens'

export function NotificationsBell(): React.JSX.Element {
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
  const totalCount = dueSoon.length + missingDeposits.length

  return (
    <>
      <IconButton
        aria-label="Notificaciones"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ color: organicColors.orange.dark }}
      >
        <Badge badgeContent={totalCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { width: 320, maxHeight: 420 } } }}
      >
        {totalCount === 0 ? (
          <Box p={2}>
            <Typography variant="body2" color="text.secondary">
              No tenés notificaciones pendientes.
            </Typography>
          </Box>
        ) : (
          <List dense>
            {dueSoon.map((reminder) => (
              <ListItemButton
                key={reminder.paymentId}
                component={RouterLink}
                to={buildPaymentDetailPath(reminder.paymentId)}
                onClick={() => setAnchor(null)}
              >
                <ListItemText
                  primary={reminder.concept}
                  secondary={formatDueLabel(reminder.dueDate)}
                />
              </ListItemButton>
            ))}
            {missingDeposits.map((payment) => (
              <ListItemButton
                key={payment.id}
                component={RouterLink}
                to={buildPaymentDetailPath(payment.id)}
                onClick={() => setAnchor(null)}
              >
                <ListItemText
                  primary={payment.concept}
                  secondary="Todavía no cargaste este depósito variable"
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Menu>
    </>
  )
}

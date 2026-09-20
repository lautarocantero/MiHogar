import { useMemo, useState } from 'react'
import { Badge, Box, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectPendingPayments } from '@/store/payments/paymentsSelectors'
import { selectActiveDebts } from '@/store/debts/debtsSelectors'
import { markNotificationRead } from '@/store/notifications/notificationsSlice'
import { selectIsNotificationRead } from '@/store/notifications/notificationsSelectors'
import { computeDueReminders } from '@/utils/domain/computeDueReminders'
import { computeDueDebtReminders } from '@/utils/domain/computeDueDebtReminders'
import { computeMissingVariableDeposits } from '@/utils/domain/computeMissingVariableDeposits'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { buildPaymentDetailPath, ROUTES } from '@/router/routes'
import { useReminderPreference } from '@/modules/settings/useReminderPreference'
import { organicColors, organicTypography } from '@/theme/tokens'
import type { RootState } from '@/store'

export function NotificationsBell(): React.JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const pendingPayments = useAppSelector(selectPendingPayments)
  const activeDebts = useAppSelector(selectActiveDebts)
  const { leadDays } = useReminderPreference()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const dueSoon = useMemo(
    () => computeDueReminders(pendingPayments, leadDays),
    [pendingPayments, leadDays]
  )
  const dueSoonDebts = useMemo(
    () => computeDueDebtReminders(activeDebts, leadDays),
    [activeDebts, leadDays]
  )
  const missingDeposits = useMemo(
    () => computeMissingVariableDeposits(pendingPayments),
    [pendingPayments]
  )

  const dueSoonItems = dueSoon.map((reminder) => ({
    id: `${reminder.paymentId}:due`,
    to: buildPaymentDetailPath(reminder.paymentId),
    primary: reminder.concept,
    secondary: formatDueLabel(reminder.dueDate)
  }))
  const dueSoonDebtItems = dueSoonDebts.map((reminder) => ({
    id: `${reminder.paymentId}:due`,
    to: ROUTES.DEBTS,
    primary: reminder.concept,
    secondary: formatDueLabel(reminder.dueDate)
  }))
  const missingDepositItems = missingDeposits.map((payment) => ({
    id: `${payment.id}:missingDeposit`,
    to: buildPaymentDetailPath(payment.id),
    primary: payment.concept,
    secondary: 'Todavía no cargaste este depósito variable'
  }))
  const allItems = [...dueSoonItems, ...dueSoonDebtItems, ...missingDepositItems]

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
      <Popover
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              maxHeight: 420,
              overflowY: 'auto',
              p: 1.25,
              backgroundColor: organicColors.background
            }
          }
        }}
      >
        {allItems.length === 0 ? (
          <Box p={2}>
            <Typography variant="body2" color="text.secondary">
              No tenés notificaciones pendientes.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {allItems.map((item) => {
              const isRead = readIds.includes(item.id)
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: '14px',
                    backgroundColor: isRead ? organicColors.surface : organicColors.orange.tint
                  }}
                >
                  <Box flexGrow={1} minWidth={0}>
                    <Typography
                      component="p"
                      noWrap
                      sx={{
                        fontFamily: organicTypography.titleFontFamily,
                        fontSize: '0.9375rem',
                        color: organicColors.orange.dark
                      }}
                    >
                      {item.primary}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.secondary}
                    </Typography>
                  </Box>
                  <Tooltip title="Marcar como vista">
                    <span>
                      <IconButton
                        size="small"
                        aria-label={`Marcar ${item.primary} como vista`}
                        disabled={isRead}
                        onClick={() => dispatch(markNotificationRead(item.id))}
                        sx={{ color: organicColors.orange.dark }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Ir a la notificación">
                    <IconButton
                      size="small"
                      aria-label={`Ir a ${item.primary}`}
                      onClick={() => {
                        setAnchor(null)
                        navigate(item.to)
                      }}
                      sx={{ color: organicColors.orange.dark }}
                    >
                      <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            })}
          </Stack>
        )}
      </Popover>
    </>
  )
}

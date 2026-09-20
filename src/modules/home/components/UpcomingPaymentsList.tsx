import { Avatar, Box, Button, Card, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDayMonth, formatDaysRemainingLabel } from '@/utils/formatting/formatDate'
import { buildPaymentDetailPath, ROUTES } from '@/router/routes'
import type { UpcomingPaymentsListProps } from '../typings/props'

export function UpcomingPaymentsList({ payments }: UpcomingPaymentsListProps): React.JSX.Element {
  if (payments.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No tenés pagos pendientes por ahora.
      </Typography>
    )
  }

  return (
    <Card component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }} elevation={0}>
      {payments.map((entry, index) => {
        const { day, month } = formatDayMonth(entry.displayDate)
        const isMostUrgent = index === 0
        const isLast = index === payments.length - 1
        const key = entry.kind === 'payment' ? entry.payment.id : `card-${entry.accountId}`
        const title =
          entry.kind === 'payment' ? entry.payment.concept : `Cierre tarjeta ${entry.accountName}`
        const subtitle =
          entry.kind === 'payment'
            ? `${formatDaysRemainingLabel(entry.displayDate)} · Se paga con ${entry.accountName}`
            : `${formatDaysRemainingLabel(entry.displayDate)} · ${entry.paymentCount} ${entry.paymentCount === 1 ? 'movimiento' : 'movimientos'}`
        const amount = entry.kind === 'payment' ? entry.payment.amount : entry.amount
        const detailPath =
          entry.kind === 'payment' ? buildPaymentDetailPath(entry.payment.id) : ROUTES.ACCOUNTS
        const detailLabel = entry.kind === 'payment' ? 'Ver pago' : 'Ver tarjeta'

        return (
          <Box
            key={key}
            component="li"
            sx={{
              p: 2,
              borderBottom: isLast ? 'none' : `1px solid ${organicColors.neutral.border}`
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: isMostUrgent ? organicColors.orange.main : organicColors.orange.tint,
                  color: isMostUrgent ? '#ffffff' : organicColors.orange.dark,
                  width: 56,
                  height: 56
                }}
              >
                <Box textAlign="center" lineHeight={1.1}>
                  <Typography variant="body2" component="div" fontWeight={700}>
                    {day}
                  </Typography>
                  <Typography variant="caption" component="div">
                    {month}
                  </Typography>
                </Box>
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h6" component="p">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: organicColors.orange.tint,
                  color: organicColors.orange.dark,
                  fontFamily: organicTypography.titleFontFamily,
                  fontSize: '1.125rem',
                  px: 2.25,
                  py: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                {formatCurrency(amount)}
              </Box>
              <Button component={RouterLink} to={detailPath} variant="outlined">
                {detailLabel}
              </Button>
            </Stack>
          </Box>
        )
      })}
    </Card>
  )
}

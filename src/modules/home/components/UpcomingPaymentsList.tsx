import { Avatar, Box, Button, Card, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDayMonth, formatDaysRemainingLabel } from '@/utils/formatting/formatDate'
import { buildPaymentDetailPath } from '@/router/routes'
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
    <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {payments.map(({ payment, accountName, displayDate }, index) => {
        const { day, month } = formatDayMonth(displayDate)
        const isMostUrgent = index === 0

        return (
          <Card key={payment.id} component="li" sx={{ p: 2 }} elevation={0}>
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
                  {payment.concept}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDaysRemainingLabel(displayDate)} · Se paga con {accountName}
                </Typography>
              </Box>
              <Typography variant="h6" component="p" color={organicColors.orange.dark}>
                {formatCurrency(payment.amount)}
              </Typography>
              <Button
                component={RouterLink}
                to={buildPaymentDetailPath(payment.id)}
                variant="outlined"
              >
                Ver pago
              </Button>
            </Stack>
          </Card>
        )
      })}
    </Stack>
  )
}

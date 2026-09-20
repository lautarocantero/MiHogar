import { Avatar, Box, Button, Card, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { organicColors, organicTypography } from '@/theme/tokens'
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
    <Card component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }} elevation={0}>
      {payments.map(({ payment, accountName, displayDate }, index) => {
        const { day, month } = formatDayMonth(displayDate)
        const isMostUrgent = index === 0
        const isLast = index === payments.length - 1

        return (
          <Box
            key={payment.id}
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
                  {payment.concept}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDaysRemainingLabel(displayDate)} · Se paga con {accountName}
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
                {formatCurrency(payment.amount)}
              </Box>
              <Button
                component={RouterLink}
                to={buildPaymentDetailPath(payment.id)}
                variant="outlined"
              >
                Ver pago
              </Button>
            </Stack>
          </Box>
        )
      })}
    </Card>
  )
}

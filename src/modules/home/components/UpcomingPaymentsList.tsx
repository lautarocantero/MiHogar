import { Avatar, Box, Button, Card, Typography } from '@mui/material'
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
            {/* En teléfonos el monto y el botón bajan a una segunda fila a todo el ancho. */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'auto minmax(0, 1fr)', sm: 'auto minmax(0, 1fr) auto' },
                alignItems: 'center',
                columnGap: 2,
                rowGap: 1.5
              }}
            >
              <Avatar
                sx={{
                  bgcolor: isMostUrgent ? organicColors.orange.main : organicColors.orange.tint,
                  color: isMostUrgent ? '#ffffff' : organicColors.orange.dark,
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 }
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
              <Box minWidth={0}>
                <Typography variant="h6" component="p" sx={{ overflowWrap: 'anywhere' }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  gridColumn: { xs: '1 / -1', sm: 'auto' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'space-between', sm: 'flex-end' },
                  gap: 2
                }}
              >
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
                <Button
                  component={RouterLink}
                  to={detailPath}
                  variant="outlined"
                  sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  {detailLabel}
                </Button>
              </Box>
            </Box>
          </Box>
        )
      })}
    </Card>
  )
}

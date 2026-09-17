import { Card, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDaysRemainingLabel } from '@/utils/formatting/formatDate'
import type { MonthPaymentsListProps } from '../typings/props'

export function MonthPaymentsList({ payments }: MonthPaymentsListProps): React.JSX.Element {
  if (payments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No tenés pagos pendientes este mes.
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {payments.map((payment) => (
        <Card key={payment.id} component="li" sx={{ p: 2 }} elevation={0}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Stack>
              <Typography variant="body1">{payment.concept}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDaysRemainingLabel(payment.displayDate)} · {payment.accountName}
              </Typography>
            </Stack>
            <Typography variant="body1" color={organicColors.orange.dark}>
              {formatCurrency(payment.amount)}
            </Typography>
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}

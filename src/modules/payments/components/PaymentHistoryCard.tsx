import { Card, Stack, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { PaymentHistoryCardProps } from '../typings/props'

export function PaymentHistoryCard({ history }: PaymentHistoryCardProps): React.JSX.Element {
  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h3">
          Historial de este pago
        </Typography>
        {history.entries.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Todavía no hay pagos anteriores registrados.
          </Typography>
        ) : (
          <Stack spacing={1} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {history.entries.map((entry) => (
              <Stack
                key={entry.movement.id}
                component="li"
                direction="row"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                  {entry.monthLabel}
                </Typography>
                <Typography variant="body2">{formatCurrency(entry.movement.amount)}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
        {history.comparativePhrase && (
          <Typography variant="body2">{history.comparativePhrase}</Typography>
        )}
      </Stack>
    </Card>
  )
}

import { Card, Chip, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { HeroBalanceCardProps } from '../typings/props'

export function HeroBalanceCard({
  totalAvailable,
  accounts,
  pendingTotal,
  pendingCount,
  remainingAfterPayments
}: HeroBalanceCardProps): React.JSX.Element {
  const isRemainingPositive = remainingAfterPayments >= 0

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Card
          sx={{
            backgroundColor: organicColors.orange.main,
            color: '#ffffff',
            p: 4,
            height: '100%'
          }}
          elevation={0}
        >
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Tenés disponible hoy
          </Typography>
          <Typography
            variant="h1"
            component="p"
            sx={{ fontSize: { xs: '2.75rem', md: '4.125rem' } }}
          >
            {formatCurrency(totalAvailable)}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
            Esto es la plata que podés usar ahora, sumando todas tus cuentas y el efectivo.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {accounts.map((account) => (
              <Chip
                key={account.id}
                label={`${account.name} · ${formatCurrency(account.balance)}`}
                sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#ffffff' }}
              />
            ))}
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={3} height="100%">
          <Card sx={{ backgroundColor: organicColors.orange.tint, p: 3 }} elevation={0}>
            <Typography variant="body1" color="text.secondary">
              Te falta pagar este mes
            </Typography>
            <Typography variant="h3" component="p" color={organicColors.orange.dark}>
              {formatCurrency(pendingTotal)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pendingCount} {pendingCount === 1 ? 'pago pendiente' : 'pagos pendientes'}
            </Typography>
          </Card>
          <Card sx={{ backgroundColor: organicColors.sage.tint, p: 3 }} elevation={0}>
            <Typography variant="body1" color="text.secondary">
              Si pagás todo, te queda
            </Typography>
            <Typography variant="h3" component="p" color={organicColors.sage.dark}>
              {formatCurrency(remainingAfterPayments)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isRemainingPositive ? 'A favor, sin deudas' : 'Vas a necesitar más plata'}
            </Typography>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  )
}

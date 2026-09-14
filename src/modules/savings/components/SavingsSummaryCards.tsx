import { Card, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { SavingsSummaryCardsProps } from '../typings/props'

export function SavingsSummaryCards({ summary }: SavingsSummaryCardsProps): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ p: 3 }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Tenés ahorrado
            </Typography>
            <Typography variant="h4" component="p">
              {formatCurrency(summary.totalSaved)}
            </Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ p: 3, backgroundColor: organicColors.sage.tint }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Te dan de interés por mes
            </Typography>
            <Typography variant="h4" component="p" color={organicColors.sage.dark}>
              + {formatCurrency(summary.monthlyInterestTotal)}
            </Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ p: 3 }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Próximo vencimiento
            </Typography>
            <Typography variant="h4" component="p">
              {summary.nextMaturityLabel ?? 'Sin vencimientos'}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  )
}

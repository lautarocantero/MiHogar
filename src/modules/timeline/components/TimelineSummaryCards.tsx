import { Card, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { TimelineSummaryCardsProps } from '../typings/props'

export function TimelineSummaryCards({ summary }: TimelineSummaryCardsProps): React.JSX.Element {
  const isDifferencePositive = summary.difference >= 0

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ p: 3, backgroundColor: organicColors.sage.tint }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Entró
            </Typography>
            <Typography variant="h4" component="p" color={organicColors.sage.dark}>
              + {formatCurrency(summary.totalIn)}
            </Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ p: 3, backgroundColor: organicColors.orange.tint }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Salió
            </Typography>
            <Typography variant="h4" component="p" color={organicColors.orange.dark}>
              − {formatCurrency(summary.totalOut)}
            </Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card sx={{ p: 3 }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Diferencia
            </Typography>
            <Typography
              variant="h4"
              component="p"
              color={isDifferencePositive ? organicColors.sage.dark : organicColors.orange.dark}
            >
              {isDifferencePositive ? '+' : '−'} {formatCurrency(Math.abs(summary.difference))}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  )
}

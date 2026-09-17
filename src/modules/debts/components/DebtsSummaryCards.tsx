import { Card, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { DebtsSummaryCardsProps } from '../typings/props'

export function DebtsSummaryCards({ summary }: DebtsSummaryCardsProps): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card sx={{ p: 3, backgroundColor: organicColors.orange.tint }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Debemos en total
            </Typography>
            <Typography variant="h4" component="p" color={organicColors.orange.dark}>
              {formatCurrency(summary.totalOwedByHousehold)}
            </Typography>
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card sx={{ p: 3, backgroundColor: organicColors.sage.tint }} elevation={0}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Nos deben en total
            </Typography>
            <Typography variant="h4" component="p" color={organicColors.sage.dark}>
              {formatCurrency(summary.totalOwedToHousehold)}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  )
}

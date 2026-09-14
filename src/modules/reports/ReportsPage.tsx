import { Box, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { MonthlyBarsChart } from './components/MonthlyBarsChart'
import { ExpenseComparisonPhrase } from './components/ExpenseComparisonPhrase'
import { CategoryBreakdownCard } from './components/CategoryBreakdownCard'
import { InflowOutflowChart } from './components/InflowOutflowChart'
import { useReportsData } from './useReportsData'

export function ReportsPage(): React.JSX.Element {
  const { monthlySeries, comparison, categoryBreakdown, currentMonthFlow, savingsRatePercent } =
    useReportsData()

  return (
    <Stack spacing={5} component="section" aria-label="Informes">
      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Cuánto gastaste cada mes
        </Typography>
        <MonthlyBarsChart series={monthlySeries} />
        <ExpenseComparisonPhrase comparison={comparison} />
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            En qué se va la plata
          </Typography>
          <CategoryBreakdownCard entries={categoryBreakdown} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Lo que entra y lo que sale
          </Typography>
          <InflowOutflowChart flow={currentMonthFlow} savingsRatePercent={savingsRatePercent} />
        </Grid>
      </Grid>
    </Stack>
  )
}

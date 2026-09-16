import { useState } from 'react'
import { format, subMonths } from 'date-fns'
import { Box, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { MonthlyBarsChart } from './components/MonthlyBarsChart'
import { ExpenseComparisonPhrase } from './components/ExpenseComparisonPhrase'
import { CategoryBreakdownCard } from './components/CategoryBreakdownCard'
import { InflowOutflowChart } from './components/InflowOutflowChart'
import { MonthComparisonPicker } from './components/MonthComparisonPicker'
import { ChartTypeToggle } from './components/ChartTypeToggle'
import { MonthComparisonChart } from './components/MonthComparisonChart'
import { useReportsData } from './useReportsData'
import { useMonthComparisonData } from './useMonthComparisonData'
import { ReportChartType } from './typings/enums'

const today = new Date()
const DEFAULT_MONTH_A = format(today, 'yyyy-MM')
const DEFAULT_MONTH_B = format(subMonths(today, 1), 'yyyy-MM')

export function ReportsPage(): React.JSX.Element {
  const { monthlySeries, comparison, categoryBreakdown, currentMonthFlow, savingsRatePercent } =
    useReportsData()
  const [monthAKey, setMonthAKey] = useState(DEFAULT_MONTH_A)
  const [monthBKey, setMonthBKey] = useState(DEFAULT_MONTH_B)
  const [chartType, setChartType] = useState(ReportChartType.BAR)
  const { monthA, monthB } = useMonthComparisonData(monthAKey, monthBKey)

  return (
    <Stack spacing={5} component="section" aria-label="Informes">
      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Cuánto gastaste cada mes
        </Typography>
        <MonthlyBarsChart series={monthlySeries} />
        <ExpenseComparisonPhrase comparison={comparison} />
      </Box>

      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <Typography variant="h6" component="h2">
            Comparar dos meses
          </Typography>
          <ChartTypeToggle value={chartType} onChange={setChartType} />
        </Stack>
        <MonthComparisonPicker
          monthAKey={monthAKey}
          monthBKey={monthBKey}
          onChangeMonthA={setMonthAKey}
          onChangeMonthB={setMonthBKey}
        />
        <Box mt={3}>
          <MonthComparisonChart chartType={chartType} monthA={monthA} monthB={monthB} />
        </Box>
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

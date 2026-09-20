import { useState } from 'react'
import { format, subMonths } from 'date-fns'
import { Box, Card, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BarChartIcon from '@mui/icons-material/BarChart'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import DonutSmallIcon from '@mui/icons-material/DonutSmall'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SouthIcon from '@mui/icons-material/South'
import NorthIcon from '@mui/icons-material/North'
import SavingsIcon from '@mui/icons-material/Savings'
import PercentIcon from '@mui/icons-material/Percent'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
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
const DEFAULT_MONTH_A = format(subMonths(today, 1), 'yyyy-MM')
const DEFAULT_MONTH_B = format(today, 'yyyy-MM')

function KpiTile({
  icon,
  label,
  value,
  valueColor
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueColor: string
}): React.JSX.Element {
  return (
    <Card
      sx={{
        p: 2.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: `1px solid ${organicColors.neutral.border}`
      }}
      elevation={0}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            flexShrink: 0,
            backgroundColor: organicColors.orange.tint,
            color: organicColors.orange.dark
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography
        component="p"
        noWrap
        sx={{
          fontFamily: organicTypography.titleFontFamily,
          fontSize: '1.625rem',
          color: valueColor
        }}
      >
        {value}
      </Typography>
    </Card>
  )
}

export function ReportsPage(): React.JSX.Element {
  const { monthlySeries, comparison, categoryBreakdown, currentMonthFlow, savingsRatePercent } =
    useReportsData()
  const [monthAKey, setMonthAKey] = useState(DEFAULT_MONTH_A)
  const [monthBKey, setMonthBKey] = useState(DEFAULT_MONTH_B)
  const [chartType, setChartType] = useState(ReportChartType.BAR)
  const { monthA, monthB } = useMonthComparisonData(monthAKey, monthBKey)

  const sectionTitleSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    fontFamily: organicTypography.titleFontFamily,
    fontSize: '1.25rem',
    fontWeight: 400,
    color: organicColors.orange.dark
  } as const

  return (
    <Stack spacing={3} component="section" aria-label="Informes">
      <Card
        sx={{
          p: 2.25,
          display: 'flex',
          gap: 1.75,
          alignItems: 'center',
          backgroundColor: '#faf0e4',
          border: '1px solid #efdcc6'
        }}
        elevation={0}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            flexShrink: 0,
            backgroundColor: '#f2dcc3',
            color: organicColors.orange.dark
          }}
        >
          <LightbulbIcon fontSize="small" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Podés comparar tus gastos, ingresos y saldos entre dos períodos para ver cómo evoluciona
          tu situación financiera.
        </Typography>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<SouthIcon fontSize="small" />}
            label="Total de gastos"
            value={formatCurrency(currentMonthFlow.totalOut)}
            valueColor={organicColors.orange.dark}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<NorthIcon fontSize="small" />}
            label="Total de ingresos"
            value={formatCurrency(currentMonthFlow.totalIn)}
            valueColor={organicColors.income.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<SavingsIcon fontSize="small" />}
            label="Ahorro neto"
            value={formatCurrency(currentMonthFlow.difference)}
            valueColor={
              currentMonthFlow.difference >= 0
                ? organicColors.income.main
                : organicColors.overdue.main
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<PercentIcon fontSize="small" />}
            label="Tasa de ahorro"
            value={`${savingsRatePercent}%`}
            valueColor={organicColors.orange.dark}
          />
        </Grid>
      </Grid>

      <Card sx={{ p: 2.5, border: `1px solid ${organicColors.neutral.border}` }} elevation={0}>
        <Typography component="h2" gutterBottom sx={sectionTitleSx}>
          <BarChartIcon aria-hidden="true" />
          Cuánto gastaste cada mes
        </Typography>
        <MonthlyBarsChart series={monthlySeries} />
        <ExpenseComparisonPhrase comparison={comparison} />
      </Card>

      <Card sx={{ p: 2.5, border: `1px solid ${organicColors.neutral.border}` }} elevation={0}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <Typography component="h2" sx={sectionTitleSx}>
            <CompareArrowsIcon aria-hidden="true" />
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
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2.5,
              height: '100%',
              border: `1px solid ${organicColors.neutral.border}`
            }}
            elevation={0}
          >
            <Typography component="h2" gutterBottom sx={sectionTitleSx}>
              <DonutSmallIcon aria-hidden="true" />
              En qué se va la plata
            </Typography>
            <CategoryBreakdownCard entries={categoryBreakdown} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 2.5,
              height: '100%',
              border: `1px solid ${organicColors.neutral.border}`
            }}
            elevation={0}
          >
            <Typography component="h2" gutterBottom sx={sectionTitleSx}>
              <SwapHorizIcon aria-hidden="true" />
              Lo que entra y lo que sale
            </Typography>
            <InflowOutflowChart flow={currentMonthFlow} savingsRatePercent={savingsRatePercent} />
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

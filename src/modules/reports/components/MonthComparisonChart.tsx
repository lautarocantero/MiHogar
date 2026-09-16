import { Box, Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { ReportChartType } from '../typings/enums'
import type { MonthComparisonChartProps } from '../typings/props'
import type { CategoryBreakdownEntry } from '@/typings/domain/types'

function totalsByCategory(entries: CategoryBreakdownEntry[], categoryNames: string[]): number[] {
  return categoryNames.map(
    (name) => entries.find((entry) => entry.categoryName === name)?.total ?? 0
  )
}

export function MonthComparisonChart({
  chartType,
  monthA,
  monthB
}: MonthComparisonChartProps): React.JSX.Element {
  const categoryNames = Array.from(
    new Set([
      ...monthA.breakdown.map((entry) => entry.categoryName),
      ...monthB.breakdown.map((entry) => entry.categoryName)
    ])
  )

  if (categoryNames.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay gastos para comparar en estos meses.
      </Typography>
    )
  }

  if (chartType === ReportChartType.PIE) {
    return (
      <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
        {[monthA, monthB].map((entry) => (
          <Box key={entry.monthKey} sx={{ minWidth: 260 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom>
              {entry.monthLabel}
            </Typography>
            <PieChart
              height={240}
              series={[
                {
                  data: entry.breakdown.map((category, index) => ({
                    id: index,
                    value: category.total,
                    label: category.categoryName
                  })),
                  valueFormatter: (item) => formatCurrency(item.value)
                }
              ]}
            />
          </Box>
        ))}
      </Stack>
    )
  }

  const seriesA = totalsByCategory(monthA.breakdown, categoryNames)
  const seriesB = totalsByCategory(monthB.breakdown, categoryNames)
  const isLine = chartType === ReportChartType.LINE

  const sharedProps = {
    height: 300,
    xAxis: [{ data: categoryNames, scaleType: (isLine ? 'point' : 'band') as 'point' | 'band' }],
    yAxis: [{ valueFormatter: (value: number): string => formatCurrency(value) }],
    series: [
      {
        id: 'monthA',
        label: monthA.monthLabel,
        data: seriesA,
        color: organicColors.orange.main,
        valueFormatter: (value: number | null): string =>
          value === null ? '' : formatCurrency(value)
      },
      {
        id: 'monthB',
        label: monthB.monthLabel,
        data: seriesB,
        color: organicColors.blue.main,
        valueFormatter: (value: number | null): string =>
          value === null ? '' : formatCurrency(value)
      }
    ],
    margin: { left: 90, top: 40 }
  }

  return isLine ? <LineChart {...sharedProps} /> : <BarChart {...sharedProps} />
}

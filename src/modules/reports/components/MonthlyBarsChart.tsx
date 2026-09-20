import { BarChart } from '@mui/x-charts/BarChart'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { MonthlyBarsChartProps } from '../typings/props'

export function MonthlyBarsChart({ series }: MonthlyBarsChartProps): React.JSX.Element {
  return (
    <BarChart
      height={280}
      xAxis={[{ data: series.map((point) => point.monthLabel), scaleType: 'band' }]}
      yAxis={[{ valueFormatter: (value: number) => formatCurrency(value) }]}
      series={[
        {
          id: 'previous',
          data: series.map((point) => (point.isCurrentMonth ? null : point.total)),
          color: organicColors.neutral.border,
          stack: 'total',
          valueFormatter: (value: number | null) => (value === null ? '' : formatCurrency(value))
        },
        {
          id: 'current',
          data: series.map((point) => (point.isCurrentMonth ? point.total : null)),
          color: organicColors.orange.main,
          stack: 'total',
          valueFormatter: (value: number | null) => (value === null ? '' : formatCurrency(value))
        }
      ]}
      barLabel={(item) => (item.value ? formatCurrency(item.value) : '')}
      margin={{ left: 90, top: 40 }}
    />
  )
}

import { LineChart } from '@mui/x-charts/LineChart'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { ProjectionAreaChartProps } from '../typings/props'

export function ProjectionAreaChart({ series }: ProjectionAreaChartProps): React.JSX.Element {
  return (
    <LineChart
      height={320}
      xAxis={[
        {
          data: series.map((point) => point.dayOfMonth),
          scaleType: 'point',
          label: 'Día del mes'
        }
      ]}
      yAxis={[{ valueFormatter: (value: number) => formatCurrency(value) }]}
      series={[
        {
          data: series.map((point) => point.balance),
          area: true,
          color: organicColors.orange.main,
          showMark: false,
          valueFormatter: (value: number | null) => (value === null ? '' : formatCurrency(value))
        }
      ]}
      sx={{
        '& .MuiLineElement-root': { strokeWidth: 6 },
        '& .MuiAreaElement-root': { fill: organicColors.orange.tint, opacity: 0.6 }
      }}
      margin={{ left: 80 }}
    />
  )
}

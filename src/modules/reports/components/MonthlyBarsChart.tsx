import { BarChart } from '@mui/x-charts/BarChart'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { useResponsive } from '@/hooks/shared/useResponsive'
import type { MonthlyBarsChartProps } from '../typings/props'

export function MonthlyBarsChart({ series }: MonthlyBarsChartProps): React.JSX.Element {
  // En teléfonos las barras son angostas y las etiquetas se pisan: el monto queda en el tooltip.
  const { isPhone } = useResponsive()
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
      barLabel={
        isPhone ? undefined : (item): string => (item.value ? formatCurrency(item.value) : '')
      }
      margin={{ left: isPhone ? 76 : 90, top: 40 }}
    />
  )
}

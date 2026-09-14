import { Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { InflowOutflowChartProps } from '../typings/props'

export function InflowOutflowChart({
  flow,
  savingsRatePercent
}: InflowOutflowChartProps): React.JSX.Element {
  const isGoodRate = savingsRatePercent >= 20

  return (
    <Stack spacing={2}>
      <BarChart
        height={220}
        layout="horizontal"
        xAxis={[{ valueFormatter: (value: number) => formatCurrency(value) }]}
        yAxis={[{ data: ['Entró', 'Salió'], scaleType: 'band' }]}
        series={[
          {
            id: 'in',
            data: [flow.totalIn, null],
            color: organicColors.sage.main,
            stack: 'total',
            valueFormatter: (value: number | null) => (value === null ? '' : formatCurrency(value))
          },
          {
            id: 'out',
            data: [null, flow.totalOut],
            color: organicColors.orange.main,
            stack: 'total',
            valueFormatter: (value: number | null) => (value === null ? '' : formatCurrency(value))
          }
        ]}
        margin={{ left: 90 }}
      />
      <Typography variant="body1">
        De cada $100 que entran, {savingsRatePercent >= 0 ? 'ahorrás' : 'te faltan'}{' '}
        <strong>${Math.abs(savingsRatePercent)}</strong>.{' '}
        {isGoodRate ? 'Vas bien.' : 'Podés mejorar.'}
      </Typography>
    </Stack>
  )
}

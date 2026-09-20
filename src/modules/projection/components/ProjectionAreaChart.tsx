import { Card, Stack, Typography } from '@mui/material'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { LineChart } from '@mui/x-charts/LineChart'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { ProjectionAreaChartProps } from '../typings/props'

export function ProjectionAreaChart({ series }: ProjectionAreaChartProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2.5, border: `1px solid ${organicColors.neutral.border}` }} elevation={0}>
      <Stack direction="row" alignItems="center" gap={1.25} mb={1.5}>
        <ShowChartIcon sx={{ color: organicColors.orange.dark }} />
        <Typography
          component="h2"
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.25rem',
            color: organicColors.orange.dark
          }}
        >
          Evolución del saldo
        </Typography>
      </Stack>
      <LineChart
        height={300}
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
    </Card>
  )
}

import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { StackedBarsChart } from '@/components/shared/StackedBarsChart'
import type { StackedBarPoint } from '@/components/shared/StackedBarsChart'
import type { SavingsEvolutionChartProps } from '../typings/props'

const RANGES = [
  { label: '3 meses', months: 3 },
  { label: '6 meses', months: 6 },
  { label: '1 año', months: 12 },
  { label: 'Todo', months: null }
]

function buildYTicks(maxValue: number): string[] {
  const step = maxValue / 4
  return [4, 3, 2, 1, 0].map((multiplier) => formatCurrency(Math.round(step * multiplier)))
}

export function SavingsEvolutionChart({ points }: SavingsEvolutionChartProps): React.JSX.Element {
  const [range, setRange] = useState('6 meses')

  const visiblePoints = useMemo(() => {
    const selectedRange = RANGES.find((option) => option.label === range)
    if (!selectedRange || selectedRange.months === null) {
      return points
    }
    return points.slice(-selectedRange.months)
  }, [points, range])

  const barPoints: StackedBarPoint[] = visiblePoints.map((point) => ({
    label: point.label,
    total: point.total,
    segments: [
      { value: point.savings, color: '#b5502a' },
      { value: point.investments, color: '#f3d3b8' }
    ]
  }))

  const maxTotal = Math.max(...visiblePoints.map((point) => point.total), 1)

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={0}
        sx={{ border: `1px solid ${organicColors.neutral.border}` }}
      >
        {RANGES.map((option) => (
          <Box
            key={option.label}
            component="button"
            type="button"
            onClick={() => setRange(option.label)}
            sx={{
              border: 'none',
              padding: '7px 15px',
              fontFamily: 'inherit',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              backgroundColor:
                range === option.label ? organicColors.orange.main : organicColors.surface,
              color:
                range === option.label ? organicColors.surface : organicColors.neutral.textSecondary
            }}
          >
            {option.label}
          </Box>
        ))}
      </Stack>
      {visiblePoints.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Todavía no hay historial suficiente para mostrar la evolución.
        </Typography>
      ) : (
        <StackedBarsChart points={barPoints} yTicks={buildYTicks(maxTotal)} />
      )}
      <Stack direction="row" spacing={2.75} flexWrap="wrap" fontSize="0.8125rem">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#b5502a' }} />
          <span>Ahorros</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#f3d3b8' }} />
          <span>Inversiones</span>
        </Stack>
      </Stack>
    </Stack>
  )
}

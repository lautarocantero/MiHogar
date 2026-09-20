import { Box, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'

export type StackedBarSegment = {
  value: number
  color: string
}

export type StackedBarPoint = {
  label: string
  segments: StackedBarSegment[]
  total: number
}

type StackedBarsChartProps = {
  points: StackedBarPoint[]
  yTicks: string[]
  height?: number
  lineColor?: string
  barWidthPercent?: number
}

export function StackedBarsChart({
  points,
  yTicks,
  height = 220,
  lineColor = organicColors.sage.main,
  barWidthPercent = 56
}: StackedBarsChartProps): React.JSX.Element {
  const maxValue = Math.max(...points.map((point) => point.total), 1)

  const linePoints = points.map((point, index) => {
    const x = ((index + 0.5) / points.length) * 100
    const y = 100 - (point.total / maxValue) * 100
    return { x, y }
  })
  const polylinePoints = linePoints.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1.5}>
        <Stack
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ height, flexShrink: 0, pb: 0.25 }}
        >
          {yTicks.map((tick) => (
            <Typography key={tick} variant="caption" color="text.secondary" whiteSpace="nowrap">
              {tick}
            </Typography>
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box
            sx={{
              position: 'relative',
              height,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              borderBottom: `1px solid ${organicColors.neutral.border}`
            }}
          >
            {points.map((point) => (
              <Box
                key={point.label}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: `${barWidthPercent}%`,
                    maxWidth: 72,
                    height: `${(point.total / maxValue) * 100}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  {point.segments.map((segment, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: '100%',
                        height: `${(segment.value / (point.total || 1)) * 100}%`,
                        backgroundColor: segment.color
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
            <Box
              component="svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              <polyline
                points={polylinePoints}
                fill="none"
                stroke={lineColor}
                strokeWidth={0.6}
                vectorEffect="non-scaling-stroke"
              />
              {linePoints.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r={1.1} fill={lineColor} />
              ))}
            </Box>
          </Box>
          <Stack direction="row" spacing={1} pt={1}>
            {points.map((point) => (
              <Typography
                key={point.label}
                variant="caption"
                color="text.secondary"
                sx={{ flex: 1, minWidth: 0, textAlign: 'center' }}
              >
                {point.label}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  )
}

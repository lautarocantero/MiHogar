import { Box, Stack, Typography } from '@mui/material'
import { organicColors, organicTypography } from '@/theme/tokens'

export type DonutSegment = {
  label: string
  amountLabel: string
  percent: number
  color: string
}

type DonutChartProps = {
  segments: DonutSegment[]
  centerValue: string
  centerLabel: string
  size?: number
}

export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  size = 168
}: DonutChartProps): React.JSX.Element {
  let acc = 0
  const stops = segments
    .map((segment) => {
      const start = acc
      acc += segment.percent
      return `${segment.color} ${start}% ${acc}%`
    })
    .join(', ')

  return (
    <Stack direction="row" spacing={3} flexWrap="wrap" alignItems="center">
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: '50%',
          background:
            segments.length > 0 ? `conic-gradient(${stops})` : organicColors.neutral.border
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: size * 0.17,
            borderRadius: '50%',
            backgroundColor: organicColors.surface,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.25,
            textAlign: 'center',
            px: 1
          }}
        >
          <Typography
            component="p"
            noWrap
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontSize: '1rem',
              color: organicColors.orange.dark
            }}
          >
            {centerValue}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {centerLabel}
          </Typography>
        </Box>
      </Box>
      <Stack spacing={1.1} flex="1 1 220px" minWidth={0}>
        {segments.map((segment) => (
          <Stack key={segment.label} direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: segment.color,
                flexShrink: 0
              }}
            />
            <Typography variant="body2" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
              {segment.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: 'nowrap', color: organicColors.orange.dark }}
            >
              {segment.amountLabel}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ width: 34, textAlign: 'right' }}
            >
              {Math.round(segment.percent)}%
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

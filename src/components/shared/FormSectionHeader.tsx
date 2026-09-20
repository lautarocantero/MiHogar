import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { organicColors, organicTypography } from '@/theme/tokens'

interface FormSectionHeaderProps {
  step: number
  title: string
  subtitle: string
}

export function FormSectionHeader({
  step,
  title,
  subtitle
}: FormSectionHeaderProps): React.JSX.Element {
  return (
    <Box
      sx={{
        pb: 1.25,
        mb: 0.25,
        borderBottom: `1px solid ${alpha(organicColors.brown.main, 0.28)}`
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            flexShrink: 0,
            borderRadius: '50%',
            backgroundColor: organicColors.brown.main,
            color: '#fffdf9',
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '0.8125rem'
          }}
        >
          {step}
        </Box>
        <Stack spacing={0}>
          <Typography
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontSize: '0.9375rem',
              lineHeight: 1.3
            }}
          >
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

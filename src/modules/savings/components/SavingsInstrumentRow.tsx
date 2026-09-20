import { Box, Card, Stack, Typography } from '@mui/material'
import SavingsIcon from '@mui/icons-material/Savings'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { SavingsInstrumentRowProps } from '../typings/props'

export function SavingsInstrumentRow({ instrument }: SavingsInstrumentRowProps): React.JSX.Element {
  const accent = instrument.colorTag ?? organicColors.sage.main

  return (
    <Card
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: organicColors.surface,
        border: `1px solid ${organicColors.neutral.border}`
      }}
      elevation={0}
    >
      <Box sx={{ alignSelf: 'stretch', width: 8, flexShrink: 0, backgroundColor: accent }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          flexShrink: 0,
          backgroundColor: organicColors.orange.tint,
          color: organicColors.orange.dark
        }}
      >
        <SavingsIcon fontSize="small" />
      </Box>
      <Box flexGrow={1} minWidth={0}>
        <Typography
          component="p"
          noWrap
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.0625rem',
            color: organicColors.orange.dark
          }}
        >
          {instrument.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {instrument.ownerLabel}
          {instrument.conditionText ? ` · ${instrument.conditionText}` : ''}
        </Typography>
      </Box>
      <Stack alignItems="flex-end" spacing={0.25}>
        <Typography
          component="p"
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.25rem',
            whiteSpace: 'nowrap'
          }}
        >
          {formatCurrency(instrument.principal)}
        </Typography>
        {instrument.monthlyDeltaPercent != null && (
          <Typography
            variant="caption"
            sx={{ color: organicColors.income.main }}
            title="Tasa mensual equivalente"
          >
            ↑ {instrument.monthlyDeltaPercent.toFixed(2)}% mensual
          </Typography>
        )}
      </Stack>
      <ChevronRightIcon sx={{ color: '#b79a84' }} />
    </Card>
  )
}

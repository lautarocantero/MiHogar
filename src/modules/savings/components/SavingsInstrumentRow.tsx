import { Box, Card, Chip, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { SavingsInstrumentRowProps } from '../typings/props'

export function SavingsInstrumentRow({ instrument }: SavingsInstrumentRowProps): React.JSX.Element {
  return (
    <Card
      component="li"
      sx={{ p: 2, borderLeft: `10px solid ${instrument.colorTag ?? organicColors.sage.main}` }}
      elevation={0}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box flexGrow={1}>
          <Typography variant="h6" component="p">
            {instrument.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {instrument.conditionText}
          </Typography>
        </Box>
        <Chip
          label={instrument.ownerLabel}
          size="small"
          sx={{ backgroundColor: organicColors.orange.tint, color: organicColors.orange.dark }}
        />
        <Typography variant="h6" component="p">
          {formatCurrency(instrument.principal)}
        </Typography>
      </Stack>
    </Card>
  )
}

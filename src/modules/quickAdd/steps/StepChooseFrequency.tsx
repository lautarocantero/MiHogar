import { Button, Stack, Typography } from '@mui/material'
import LooksOneIcon from '@mui/icons-material/LooksOne'
import RepeatIcon from '@mui/icons-material/Repeat'
import { MovementType } from '@/typings/domain/enums'
import { organicColors, organicTypography } from '@/theme/tokens'
import type { StepChooseFrequencyProps } from '../typings/props'

const QUESTION_LABEL: Record<MovementType, string> = {
  [MovementType.EXPENSE]: '¿Es un pago único o recurrente?',
  [MovementType.INCOME]: '¿Es un ingreso único o recurrente?',
  [MovementType.TRANSFER]: '¿Es único o recurrente?'
}

export function StepChooseFrequency({
  type,
  onChooseOneOff,
  onChooseRecurring,
  onBack
}: StepChooseFrequencyProps): React.JSX.Element {
  return (
    <Stack spacing={2}>
      <Typography
        component="h2"
        sx={{
          fontFamily: organicTypography.titleFontFamily,
          fontSize: '1.25rem',
          fontWeight: 400,
          color: organicColors.orange.dark
        }}
      >
        Paso 2 — {QUESTION_LABEL[type]}
      </Typography>
      <Stack spacing={1.5}>
        <Button
          variant="contained"
          size="large"
          startIcon={<LooksOneIcon />}
          onClick={onChooseOneOff}
          sx={{ justifyContent: 'flex-start', py: 2, fontSize: '1.125rem', borderRadius: 0 }}
        >
          Única vez
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<RepeatIcon />}
          onClick={onChooseRecurring}
          sx={{
            justifyContent: 'flex-start',
            py: 2,
            fontSize: '1.125rem',
            borderRadius: 0,
            borderColor: organicColors.sage.main,
            color: organicColors.sage.dark
          }}
        >
          Se repite todos los meses
        </Button>
      </Stack>
      <Button variant="text" onClick={onBack} sx={{ alignSelf: 'flex-start' }}>
        Volver
      </Button>
    </Stack>
  )
}

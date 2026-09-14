import { Button, Stack, Typography } from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments'
import SavingsIcon from '@mui/icons-material/Savings'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { MovementType } from '@/typings/domain/enums'
import { organicColors } from '@/theme/tokens'
import type { StepChooseTypeProps } from '../typings/props'

export function StepChooseType({ onChoose }: StepChooseTypeProps): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" component="h2">
        Paso 1 — ¿Qué querés anotar?
      </Typography>
      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PaymentsIcon />}
          onClick={() => onChoose(MovementType.EXPENSE)}
          sx={{ justifyContent: 'flex-start', py: 2, fontSize: '1.125rem' }}
        >
          Pagué algo
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<SavingsIcon />}
          onClick={() => onChoose(MovementType.INCOME)}
          sx={{
            justifyContent: 'flex-start',
            py: 2,
            fontSize: '1.125rem',
            borderColor: organicColors.sage.main,
            color: organicColors.sage.dark
          }}
        >
          Recibí dinero
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<SwapHorizIcon />}
          onClick={() => onChoose(MovementType.TRANSFER)}
          sx={{ justifyContent: 'flex-start', py: 2, fontSize: '1.125rem' }}
        >
          Pasé plata de una cuenta a otra
        </Button>
      </Stack>
    </Stack>
  )
}

import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments'
import SavingsIcon from '@mui/icons-material/Savings'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { MovementType } from '@/typings/domain/enums'
import { organicColors, organicTypography } from '@/theme/tokens'
import type { StepChooseTypeProps } from '../typings/props'

const OPTIONS = [
  {
    type: MovementType.EXPENSE,
    icon: PaymentsIcon,
    title: 'Pagué algo',
    subtitle: 'Un gasto, factura o compra',
    accent: organicColors.orange
  },
  {
    type: MovementType.INCOME,
    icon: SavingsIcon,
    title: 'Recibí dinero',
    subtitle: 'Un ingreso, sueldo o cobro',
    accent: organicColors.sage
  },
  {
    type: MovementType.TRANSFER,
    icon: SwapHorizIcon,
    title: 'Pasé plata de una cuenta a otra',
    subtitle: 'Una transferencia entre tus cuentas',
    accent: organicColors.brown
  }
] as const

export function StepChooseType({ onChoose }: StepChooseTypeProps): React.JSX.Element {
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
        Paso 1 — ¿Qué querés anotar?
      </Typography>
      {OPTIONS.map(({ type, icon: Icon, title, subtitle, accent }) => (
        <ButtonBase
          key={type}
          onClick={() => onChoose(type)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            border: `1px solid ${organicColors.neutral.border}`,
            textAlign: 'left',
            '&:hover': { backgroundColor: accent.tint }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              flexShrink: 0,
              backgroundColor: accent.tint,
              color: accent.dark
            }}
          >
            <Icon />
          </Box>
          <Box flexGrow={1} minWidth={0}>
            <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ color: organicColors.neutral.textSecondary }} />
        </ButtonBase>
      ))}
    </Stack>
  )
}

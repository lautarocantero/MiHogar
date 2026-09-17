import { Stack } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { PaymentMethodFilter } from '../typings/enums'
import type { PaymentMethodPillsProps } from '../typings/props'

export function PaymentMethodPills({
  activeMethod,
  onChange
}: PaymentMethodPillsProps): React.JSX.Element {
  return (
    <Stack direction="row" spacing={1} role="group" aria-label="Filtrar por método de pago">
      <ToggleButtonGroup
        exclusive
        value={activeMethod}
        onChange={(_event, value: PaymentMethodFilter | null) => value && onChange(value)}
        sx={{
          '& .MuiToggleButton-root': {
            borderRadius: 999,
            border: 'none',
            px: 3,
            minHeight: 48,
            textTransform: 'none',
            fontSize: '1.0625rem'
          }
        }}
      >
        <ToggleButton value={PaymentMethodFilter.ALL}>Todos los métodos</ToggleButton>
        <ToggleButton value={PaymentMethodFilter.CASH}>Efectivo</ToggleButton>
        <ToggleButton value={PaymentMethodFilter.CREDIT_CARD}>Tarjeta</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

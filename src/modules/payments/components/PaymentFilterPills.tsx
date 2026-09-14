import { Stack } from '@mui/material'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { PaymentFilter } from '../typings/enums'
import type { PaymentFilterPillsProps } from '../typings/props'

export function PaymentFilterPills({
  activeFilter,
  pendingCount,
  paidCount,
  totalCount,
  onChange
}: PaymentFilterPillsProps): React.JSX.Element {
  return (
    <Stack direction="row" spacing={1} role="group" aria-label="Filtrar pagos">
      <ToggleButtonGroup
        exclusive
        value={activeFilter}
        onChange={(_event, value: PaymentFilter | null) => value && onChange(value)}
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
        <ToggleButton value={PaymentFilter.PENDING}>Pendientes ({pendingCount})</ToggleButton>
        <ToggleButton value={PaymentFilter.PAID}>Ya pagados ({paidCount})</ToggleButton>
        <ToggleButton value={PaymentFilter.ALL}>Todos ({totalCount})</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

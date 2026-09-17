import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { DebtStatus } from '@/typings/domain/enums'
import { useRegisterInstallmentPayment } from '../useRegisterInstallmentPayment'
import type { DebtRowProps } from '../typings/props'

export function DebtRow({ debt, onEdit, onDelete }: DebtRowProps): React.JSX.Element {
  const isPaidOff = debt.status === DebtStatus.PAID_OFF
  const { submit: registerInstallmentPayment, isSubmitting } = useRegisterInstallmentPayment(debt)

  return (
    <Card component="li" sx={{ p: 2 }} elevation={0}>
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box flexGrow={1}>
            <Typography variant="h6" component="p">
              {debt.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {debt.counterparty}
              {debt.conditionText ? ` · ${debt.conditionText}` : ''}
            </Typography>
          </Box>
          <Chip
            label={debt.ownerLabel}
            size="small"
            sx={{ backgroundColor: organicColors.orange.tint, color: organicColors.orange.dark }}
          />
          <Typography variant="h6" component="p">
            {formatCurrency(debt.outstandingBalance)}
          </Typography>
          <IconButton aria-label={`Editar ${debt.name}`} onClick={() => onEdit(debt)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={`Eliminar ${debt.name}`}
            onClick={() => onDelete(debt)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
        {debt.progressPercent != null && (
          <LinearProgress
            variant="determinate"
            value={debt.progressPercent}
            sx={{ borderRadius: 999, height: 8 }}
          />
        )}
        {!isPaidOff && debt.installmentAmount != null && (
          <Stack direction="row" justifyContent="flex-end">
            <Button
              size="small"
              variant="outlined"
              onClick={registerInstallmentPayment}
              disabled={isSubmitting}
            >
              Registrar pago de cuota
            </Button>
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

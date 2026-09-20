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
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import CallReceivedIcon from '@mui/icons-material/CallReceived'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { DebtDirection, DebtStatus } from '@/typings/domain/enums'
import { useRegisterInstallmentPayment } from '../useRegisterInstallmentPayment'
import type { DebtRowProps } from '../typings/props'

export function DebtRow({ debt, onEdit, onDelete }: DebtRowProps): React.JSX.Element {
  const isPaidOff = debt.status === DebtStatus.PAID_OFF
  const isOwedByHousehold = debt.direction === DebtDirection.OWED_BY_HOUSEHOLD
  const accent = isOwedByHousehold ? organicColors.overdue : organicColors.income
  const accentIconBg = isOwedByHousehold
    ? organicColors.overdue.border
    : organicColors.income.iconBg
  const { submit: registerInstallmentPayment, isSubmitting } = useRegisterInstallmentPayment(debt)

  return (
    <Card
      component="li"
      sx={{
        p: 2,
        backgroundColor: organicColors.surface,
        border: `1px solid ${organicColors.neutral.border}`
      }}
      elevation={0}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              flexShrink: 0,
              backgroundColor: accentIconBg,
              color: accent.main
            }}
          >
            {isOwedByHousehold ? (
              <RequestQuoteIcon fontSize="small" />
            ) : (
              <CallReceivedIcon fontSize="small" />
            )}
          </Box>
          <Box flexGrow={1} minWidth={0}>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.0625rem',
                color: organicColors.orange.dark
              }}
            >
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
          <Typography
            component="p"
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontSize: '1.25rem',
              color: accent.main,
              whiteSpace: 'nowrap'
            }}
          >
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
            sx={{
              height: 8,
              backgroundColor: organicColors.neutral.border,
              '& .MuiLinearProgress-bar': { backgroundColor: accent.main }
            }}
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

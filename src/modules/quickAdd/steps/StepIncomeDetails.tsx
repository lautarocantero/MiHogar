import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  InputAdornment,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { AccountType, Currency, MovementType } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { organicColors } from '@/theme/tokens'
import { NumberField } from '@/components/shared/NumberField'
import { CategoryField } from '@/components/shared/CategoryField'
import { parseAmountInput } from '@/utils/formatting/parseAmountInput'
import { CategoryKind } from '@/typings/domain/enums'
import type { StepAmountAndDetailsProps } from '../typings/props'
import type { QuickAddFormValues } from '../typings/types'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

type ReceiveMethod = 'cash' | 'transfer'

function pillStyle(active: boolean): object {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.1,
    px: 1.75,
    py: 1,
    cursor: 'pointer',
    fontSize: '0.875rem',
    backgroundColor: active ? organicColors.sage.tint : organicColors.surface,
    border: `1px solid ${active ? organicColors.sage.main : organicColors.neutral.border}`,
    color: active ? organicColors.sage.dark : 'text.primary'
  }
}

export function StepIncomeDetails({
  onSubmit,
  onBack,
  isSubmitting,
  errorMessage
}: StepAmountAndDetailsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const members = useAppSelector(selectAllMembers)

  const destinationAccounts = useMemo(
    () => accounts.filter((account) => account.type !== AccountType.CREDIT_CARD),
    [accounts]
  )

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<ReceiveMethod>('cash')
  const [currency, setCurrency] = useState<Currency>(Currency.ARS)
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [accountId, setAccountId] = useState('')
  const [date, setDate] = useState(TODAY_ISO)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSave = (): void => {
    const value = parseAmountInput(amount)
    if (!value || value <= 0) {
      setFormError('Ingresá un monto')
      return
    }
    if (!categoryId) {
      setFormError('Elegí de qué fue')
      return
    }
    if (!accountId) {
      setFormError('Elegí a qué cuenta entra')
      return
    }
    if (!date) {
      setFormError('Elegí el día')
      return
    }

    setFormError(null)
    const values: QuickAddFormValues = {
      type: MovementType.INCOME,
      amount: value,
      currency,
      date,
      categoryId,
      accountId,
      note: note || undefined
    }
    onSubmit([values])
  }

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.75}>
        <Typography variant="caption" color="text.secondary">
          ¿Cuánto fue?
        </Typography>
        <NumberField
          autoFocus
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0"
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
            htmlInput: { style: { fontSize: '1.5rem' } }
          }}
        />
      </Stack>

      <Box
        component="fieldset"
        sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.5, m: 0 }}
      >
        <Typography component="legend" variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
          Método de pago
        </Typography>
        <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
          {[
            { id: 'cash' as const, label: 'Efectivo' },
            { id: 'transfer' as const, label: 'Transferencia' }
          ].map((option) => (
            <Box key={option.id} component="label" sx={pillStyle(method === option.id)}>
              <input
                type="radio"
                name="receiveMethod"
                checked={method === option.id}
                onChange={() => setMethod(option.id)}
                style={{ accentColor: organicColors.sage.dark, width: 15, height: 15 }}
              />
              <span>{option.label}</span>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        component="fieldset"
        sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.5, m: 0 }}
      >
        <Typography component="legend" variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
          Moneda
        </Typography>
        <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
          {[
            { id: Currency.ARS, label: 'Pesos' },
            { id: Currency.USD, label: 'Dólares' }
          ].map((option) => (
            <Box key={option.id} component="label" sx={pillStyle(currency === option.id)}>
              <input
                type="radio"
                name="incomeCurrency"
                checked={currency === option.id}
                onChange={() => setCurrency(option.id)}
                style={{ accentColor: organicColors.sage.dark, width: 15, height: 15 }}
              />
              <span>{option.label}</span>
            </Box>
          ))}
        </Stack>
      </Box>

      <CategoryField
        kind={CategoryKind.INCOME}
        label="Concepto"
        value={categoryId}
        onChange={setCategoryId}
      />

      <TextField
        label="Nota/aclaración (opcional)"
        multiline
        minRows={2}
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

      <TextField
        label="¿A qué cuenta entra?"
        select
        value={accountId}
        onChange={(event) => setAccountId(event.target.value)}
      >
        {destinationAccounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name} · {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="¿Qué día?"
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />

      {(formError || errorMessage) && <Alert severity="error">{formError ?? errorMessage}</Alert>}

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
        <Button variant="outlined" size="large" onClick={onBack} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button variant="contained" size="large" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar el movimiento'}
        </Button>
      </Stack>
    </Stack>
  )
}

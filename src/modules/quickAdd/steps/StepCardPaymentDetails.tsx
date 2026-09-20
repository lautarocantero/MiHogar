import { useMemo, useState } from 'react'
import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { AccountType, Currency, MovementType } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { organicColors } from '@/theme/tokens'
import { NumberField } from '@/components/shared/NumberField'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { parseAmountInput } from '@/utils/formatting/parseAmountInput'
import type { StepAmountAndDetailsProps } from '../typings/props'
import type { QuickAddFormValues } from '../typings/types'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

type PayMode = 'total' | 'partial'

function pillStyle(active: boolean): object {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.1,
    px: 1.75,
    py: 1,
    cursor: 'pointer',
    fontSize: '0.875rem',
    backgroundColor: active ? organicColors.blue.tint : organicColors.surface,
    border: `1px solid ${active ? organicColors.blue.main : organicColors.neutral.border}`,
    color: active ? organicColors.blue.dark : 'text.primary'
  }
}

export function StepCardPaymentDetails({
  onSubmit,
  onBack,
  isSubmitting,
  errorMessage
}: StepAmountAndDetailsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const members = useAppSelector(selectAllMembers)

  const cardAccounts = useMemo(
    () => accounts.filter((account) => account.type === AccountType.CREDIT_CARD),
    [accounts]
  )
  const payerAccounts = useMemo(
    () => accounts.filter((account) => account.type !== AccountType.CREDIT_CARD),
    [accounts]
  )

  const [cardAccountId, setCardAccountId] = useState('')
  const [payMode, setPayMode] = useState<PayMode>('total')
  const [partialAmount, setPartialAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>(Currency.ARS)
  const [payerAccountId, setPayerAccountId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(TODAY_ISO)
  const [formError, setFormError] = useState<string | null>(null)

  const selectedCard = cardAccounts.find((account) => account.id === cardAccountId)
  const cardDebt = selectedCard ? (selectedCard.usedAmount ?? 0) : 0

  const handleSave = (): void => {
    if (!cardAccountId) {
      setFormError('Elegí qué tarjeta pagás')
      return
    }
    if (!payerAccountId) {
      setFormError('Elegí con qué cuenta pagás')
      return
    }
    if (!date) {
      setFormError('Elegí el día')
      return
    }

    const amount = payMode === 'total' ? cardDebt : parseAmountInput(partialAmount)
    if (!amount || amount <= 0) {
      setFormError('Ingresá un monto válido')
      return
    }
    if (payMode === 'partial' && amount > cardDebt) {
      setFormError('El pago no puede superar la deuda de la tarjeta')
      return
    }

    setFormError(null)
    const values: QuickAddFormValues = {
      type: MovementType.CARD_PAYMENT,
      amount,
      currency,
      date,
      accountId: cardAccountId,
      toAccountId: payerAccountId,
      note: note || undefined
    }
    onSubmit([values])
  }

  return (
    <Stack spacing={2.5}>
      <TextField
        label="¿Qué tarjeta pagás?"
        select
        value={cardAccountId}
        onChange={(event) => setCardAccountId(event.target.value)}
      >
        {cardAccounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name} · {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
          </MenuItem>
        ))}
      </TextField>

      {selectedCard && (
        <Typography variant="body2" color="text.secondary">
          Usado en esta tarjeta: {formatCurrency(cardDebt)}
        </Typography>
      )}

      <Box
        component="fieldset"
        sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.5, m: 0 }}
      >
        <Typography component="legend" variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
          ¿Pagás todo o una parte?
        </Typography>
        <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
          {[
            { id: 'total' as const, label: 'Pago total' },
            { id: 'partial' as const, label: 'Pago parcial' }
          ].map((option) => (
            <Box key={option.id} component="label" sx={pillStyle(payMode === option.id)}>
              <input
                type="radio"
                name="payMode"
                checked={payMode === option.id}
                onChange={() => setPayMode(option.id)}
                style={{ accentColor: organicColors.blue.dark, width: 15, height: 15 }}
              />
              <span>{option.label}</span>
            </Box>
          ))}
        </Stack>
      </Box>

      {payMode === 'partial' && (
        <NumberField
          label="¿Cuánto pagás?"
          value={partialAmount}
          onChange={(event) => setPartialAmount(event.target.value)}
          placeholder="0"
        />
      )}

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
                name="currency"
                checked={currency === option.id}
                onChange={() => setCurrency(option.id)}
                style={{ accentColor: organicColors.blue.dark, width: 15, height: 15 }}
              />
              <span>{option.label}</span>
            </Box>
          ))}
        </Stack>
      </Box>

      <TextField
        label="¿Con qué cuenta pagás?"
        select
        value={payerAccountId}
        onChange={(event) => setPayerAccountId(event.target.value)}
      >
        {payerAccounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name} · {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Nota/aclaración (opcional)"
        multiline
        minRows={2}
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />

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
          {isSubmitting ? 'Guardando…' : 'Guardar el pago'}
        </Button>
      </Stack>
    </Stack>
  )
}

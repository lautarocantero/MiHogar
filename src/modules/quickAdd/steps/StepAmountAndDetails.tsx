import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { AccountType, CategoryKind, Currency, MovementType } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { organicColors, organicTypography } from '@/theme/tokens'
import { NumberField } from '@/components/shared/NumberField'
import { CategoryField } from '@/components/shared/CategoryField'
import { LeafButton } from '@/components/shared/LeafButton'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { parseAmountInput } from '@/utils/formatting/parseAmountInput'
import type { StepAmountAndDetailsProps } from '../typings/props'
import type { QuickAddFormValues } from '../typings/types'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

type ItemMode = 'single' | 'multi'
type PaymentMethod = 'cash' | 'transfer' | 'card'

type DraftItem = { label: string; amount: number }

function pillStyle(active: boolean): object {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.1,
    px: 1.75,
    py: 1,
    cursor: 'pointer',
    fontSize: '0.875rem',
    backgroundColor: active ? organicColors.orange.tint : organicColors.surface,
    border: `1px solid ${active ? organicColors.orange.main : organicColors.neutral.border}`,
    color: active ? organicColors.orange.dark : 'text.primary'
  }
}

export function StepAmountAndDetails({
  type,
  onSubmit,
  onBack,
  isSubmitting,
  errorMessage
}: StepAmountAndDetailsProps): React.JSX.Element {
  const isTransfer = type === MovementType.TRANSFER
  const accounts = useAppSelector(selectAllAccounts)
  const members = useAppSelector(selectAllMembers)
  const categoryKind = type === MovementType.INCOME ? CategoryKind.INCOME : CategoryKind.EXPENSE

  const [itemMode, setItemMode] = useState<ItemMode>('single')
  const [method, setMethod] = useState<PaymentMethod>(isTransfer ? 'transfer' : 'cash')
  const [currency, setCurrency] = useState<Currency>(Currency.ARS)
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [accountId, setAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [date, setDate] = useState(TODAY_ISO)
  const [items, setItems] = useState<DraftItem[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const isMulti = itemMode === 'multi' && !isTransfer

  const nonCardAccounts = useMemo(
    () => accounts.filter((account) => account.type !== AccountType.CREDIT_CARD),
    [accounts]
  )
  const cardAccounts = useMemo(
    () => accounts.filter((account) => account.type === AccountType.CREDIT_CARD),
    [accounts]
  )
  const accountOptions = isTransfer
    ? nonCardAccounts
    : method === 'card'
      ? cardAccounts
      : nonCardAccounts

  const accountLabel = isTransfer
    ? '¿De qué cuenta sale?'
    : method === 'card'
      ? '¿Con qué tarjeta se paga?'
      : '¿Con qué cuenta se paga?'

  const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0)

  const buildValues = (overrideAmount?: number, overrideNote?: string): QuickAddFormValues =>
    ({
      type,
      amount: overrideAmount ?? parseAmountInput(amount),
      currency,
      date,
      categoryId: isTransfer ? undefined : categoryId,
      accountId,
      toAccountId: isTransfer ? toAccountId : undefined,
      note: overrideNote ?? note
    }) as QuickAddFormValues

  const validateCommon = (): string | null => {
    if (!accountId) return isTransfer ? 'Elegí de qué cuenta sale' : 'Elegí una cuenta'
    if (isTransfer && !toAccountId) return 'Elegí a qué cuenta entra'
    if (isTransfer && toAccountId === accountId) return 'Elegí dos cuentas distintas'
    if (!isTransfer && !categoryId) return 'Elegí de qué fue'
    if (!date) return 'Elegí el día'
    return null
  }

  const handleAddItem = (): void => {
    const value = parseAmountInput(amount)
    if (!value || value <= 0) {
      setFormError('Ingresá un monto para el elemento')
      return
    }
    if (!note.trim()) {
      setFormError('Escribí la nota/aclaración del elemento')
      return
    }
    setFormError(null)
    setItems((prev) => prev.concat([{ label: note.trim(), amount: value }]))
    setAmount('')
    setNote('')
  }

  const handleSave = (): void => {
    const commonError = validateCommon()
    if (commonError) {
      setFormError(commonError)
      return
    }

    if (isMulti && items.length > 0) {
      onSubmit(items.map((item) => buildValues(item.amount, item.label)))
      return
    }

    const value = parseAmountInput(amount)
    if (!value || value <= 0) {
      setFormError('Ingresá un monto')
      return
    }
    setFormError(null)
    onSubmit([buildValues(value, note)])
  }

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5}>
            <FormSectionHeader
              step={1}
              title="Información básica"
              subtitle="Completá los datos del movimiento"
            />
            {!isTransfer && (
              <Box
                component="fieldset"
                sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.5, m: 0 }}
              >
                <Typography
                  component="legend"
                  variant="caption"
                  color="text.secondary"
                  sx={{ px: 0.5 }}
                >
                  ¿Cuántos elementos tiene esta compra?
                </Typography>
                <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
                  {[
                    { id: 'single' as const, label: 'Un solo elemento' },
                    { id: 'multi' as const, label: 'Varios elementos' }
                  ].map((option) => (
                    <Box key={option.id} component="label" sx={pillStyle(itemMode === option.id)}>
                      <input
                        type="radio"
                        name="itemMode"
                        checked={itemMode === option.id}
                        onChange={() => setItemMode(option.id)}
                        style={{ accentColor: organicColors.orange.dark, width: 15, height: 15 }}
                      />
                      <span>{option.label}</span>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Stack spacing={0.75}>
              <Typography variant="caption" color="text.secondary">
                {isMulti ? '¿Cuánto sale cada elemento?' : '¿Cuánto fue?'}
              </Typography>
              <NumberField
                autoFocus
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            backgroundColor: organicColors.orange.main,
                            color: '#fffdf9',
                            fontWeight: 700
                          }}
                        >
                          $
                        </Box>
                      </InputAdornment>
                    )
                  },
                  htmlInput: { style: { fontSize: '1.5rem' } }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: organicColors.orange.main, borderWidth: 2 }
                  }
                }}
              />
              {isMulti && (
                <Typography variant="caption" color="text.secondary">
                  Precio individual por elemento
                </Typography>
              )}
            </Stack>

            {!isTransfer && (
              <Box
                component="fieldset"
                sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.5, m: 0 }}
              >
                <Typography
                  component="legend"
                  variant="caption"
                  color="text.secondary"
                  sx={{ px: 0.5 }}
                >
                  Método de pago
                </Typography>
                <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
                  {[
                    { id: 'cash' as const, label: 'Efectivo' },
                    { id: 'transfer' as const, label: 'Transferencia' },
                    { id: 'card' as const, label: 'Tarjeta de crédito' }
                  ].map((option) => (
                    <Box key={option.id} component="label" sx={pillStyle(method === option.id)}>
                      <input
                        type="radio"
                        name="method"
                        checked={method === option.id}
                        onChange={() => {
                          setMethod(option.id)
                          setAccountId('')
                        }}
                        style={{ accentColor: organicColors.orange.dark, width: 15, height: 15 }}
                      />
                      <span>{option.label}</span>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <Box
              component="fieldset"
              sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.5, m: 0 }}
            >
              <Typography
                component="legend"
                variant="caption"
                color="text.secondary"
                sx={{ px: 0.5 }}
              >
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
                      style={{ accentColor: organicColors.orange.dark, width: 15, height: 15 }}
                    />
                    <span>{option.label}</span>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5}>
            <FormSectionHeader
              step={2}
              title="Detalles del movimiento"
              subtitle="Completá la información adicional"
            />
            {!isTransfer && (
              <CategoryField
                kind={categoryKind}
                label="Concepto de pago"
                value={categoryId}
                onChange={setCategoryId}
              />
            )}

            <TextField
              fullWidth
              label="Nota/aclaración (opcional)"
              placeholder="Describí qué es este elemento"
              multiline
              minRows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />

            <TextField
              fullWidth
              label={accountLabel}
              select
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
            >
              {accountOptions.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} · {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
                </MenuItem>
              ))}
            </TextField>

            {isTransfer && (
              <TextField
                fullWidth
                label="¿A qué cuenta entra?"
                select
                value={toAccountId}
                onChange={(event) => setToAccountId(event.target.value)}
              >
                {nonCardAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} ·{' '}
                    {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              fullWidth
              label="¿Qué día?"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Stack>
        </Grid>
      </Grid>

      {isMulti && items.length > 0 && (
        <Box
          sx={{
            border: `1px solid ${organicColors.neutral.border}`,
            backgroundColor: '#fbf6f0',
            p: 1.75
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Elementos cargados en esta compra ({items.length})
          </Typography>
          <Stack spacing={1} sx={{ maxHeight: 168, overflowY: 'auto', mt: 1, pr: 0.5 }}>
            {items.map((item, index) => (
              <Stack
                key={`${item.label}-${index}`}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  backgroundColor: organicColors.surface,
                  border: `1px solid ${organicColors.neutral.border}`,
                  px: 1.5,
                  py: 1
                }}
              >
                <ShoppingBagIcon fontSize="small" sx={{ color: organicColors.orange.dark }} />
                <Typography variant="body2" noWrap flexGrow={1}>
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: organicTypography.titleFontFamily,
                    fontSize: '0.9375rem',
                    color: organicColors.orange.dark,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formatCurrency(item.amount)}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ borderTop: `1px solid ${organicColors.neutral.border}`, pt: 1, mt: 1 }}
          >
            <Typography variant="body2">Total de la compra</Typography>
            <Typography
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                color: organicColors.orange.dark
              }}
            >
              {formatCurrency(itemsTotal)}
            </Typography>
          </Stack>
        </Box>
      )}

      {(formError || errorMessage) && <Alert severity="error">{formError ?? errorMessage}</Alert>}

      <Stack spacing={1.25} sx={{ borderTop: `1px solid ${organicColors.neutral.border}`, pt: 2 }}>
        {isMulti && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{
              borderRadius: 0,
              borderStyle: 'dashed',
              borderColor: organicColors.orange.main,
              color: organicColors.orange.dark
            }}
          >
            Agregar otro elemento
          </Button>
        )}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            size="large"
            onClick={onBack}
            disabled={isSubmitting}
            sx={{ borderRadius: 0 }}
          >
            Cancelar
          </Button>
          <LeafButton size="large" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar el movimiento'}
          </LeafButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

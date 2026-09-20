import { Controller } from 'react-hook-form'
import { InputAdornment, MenuItem, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { AccountType, CategoryKind, MovementType } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { organicColors } from '@/theme/tokens'
import { NumberField } from '@/components/shared/NumberField'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { parseAmountInput } from '@/utils/formatting/parseAmountInput'
import { CategoryField } from '@/components/shared/CategoryField'
import type { MovementFormFieldsProps } from '../typings/props'

export function MovementFormFields({
  register,
  control,
  errors,
  type
}: MovementFormFieldsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const members = useAppSelector(selectAllMembers)
  const isTransfer = type === MovementType.TRANSFER
  const isCardPayment = type === MovementType.CARD_PAYMENT
  const isSecondaryAccountField = isTransfer || isCardPayment
  const categoryKind = type === MovementType.INCOME ? CategoryKind.INCOME : CategoryKind.EXPENSE
  const primaryAccountOptions = isCardPayment
    ? accounts.filter((account) => account.type === AccountType.CREDIT_CARD)
    : accounts
  const secondaryAccountOptions = isCardPayment
    ? accounts.filter((account) => account.type !== AccountType.CREDIT_CARD)
    : accounts

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3} direction="column">
          <Grid>
            <FormSectionHeader
              step={1}
              title="Información básica"
              subtitle="Completá los datos del movimiento"
            />
          </Grid>
          <Grid>
            <NumberField
              label="¿Cuánto fue?"
              autoFocus
              {...register('amount', { setValueAs: parseAmountInput })}
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                htmlInput: { style: { fontSize: '1.75rem' } }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 999,
                  '& fieldset': { borderColor: organicColors.orange.main, borderWidth: 3 }
                }
              }}
            />
          </Grid>
          {!isSecondaryAccountField && (
            <Grid>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <CategoryField
                    kind={categoryKind}
                    label="Concepto de pago"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={Boolean(errors.categoryId)}
                    helperText={errors.categoryId?.message}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3} direction="column">
          <Grid>
            <FormSectionHeader
              step={2}
              title="Detalles del movimiento"
              subtitle="Completá la información adicional"
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Nota/aclaración (opcional)"
              placeholder="Agregá contexto si hace falta"
              multiline
              minRows={2}
              {...register('note')}
              error={Boolean(errors.note)}
              helperText={errors.note?.message}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label={
                isTransfer
                  ? '¿De qué cuenta sale?'
                  : isCardPayment
                    ? '¿Qué tarjeta?'
                    : '¿Con qué cuenta?'
              }
              select
              {...register('accountId')}
              error={Boolean(errors.accountId)}
              helperText={errors.accountId?.message}
            >
              {primaryAccountOptions.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} · {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {isSecondaryAccountField && (
            <Grid>
              <TextField
                fullWidth
                label={isCardPayment ? '¿Con qué cuenta pagás?' : '¿A qué cuenta entra?'}
                select
                {...register('toAccountId')}
                error={Boolean(errors.toAccountId)}
                helperText={errors.toAccountId?.message}
              >
                {secondaryAccountOptions.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} ·{' '}
                    {resolveOwnerLabel(account.ownerType, account.ownerId, members)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid>
            <TextField
              fullWidth
              label="¿Qué día?"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('date')}
              error={Boolean(errors.date)}
              helperText={errors.date?.message}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

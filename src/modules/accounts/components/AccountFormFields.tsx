import { Box, MenuItem, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller } from 'react-hook-form'
import { AccountType, Currency, OwnerType } from '@/typings/domain/enums'
import { resolveAccountTypeLabel } from '@/utils/domain/resolveAccountTypeLabel'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import { NumberField } from '@/components/shared/NumberField'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import type { AccountFormFieldsProps } from '../typings/props'

const ACCOUNT_TYPES = [AccountType.BANK, AccountType.CASH, AccountType.CREDIT_CARD]
const SOURCE_ACCOUNT_TYPES = [AccountType.BANK, AccountType.CASH]

export function AccountFormFields({
  register,
  control,
  errors,
  selectedType,
  selectedOwnerType,
  selectedCurrency
}: AccountFormFieldsProps): React.JSX.Element {
  const allAccounts = useAppSelector(selectAllAccounts)
  const sourceAccountOptions = allAccounts.filter((account) =>
    SOURCE_ACCOUNT_TYPES.includes(account.type)
  )

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Nombre de la cuenta"
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Tipo de cuenta"
          select
          {...register('type')}
          defaultValue={selectedType}
        >
          {ACCOUNT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {resolveAccountTypeLabel(type)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Moneda
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {[
            { id: Currency.ARS, label: 'Pesos' },
            { id: Currency.USD, label: 'Dólares' }
          ].map((option) => (
            <Box
              key={option.id}
              component="label"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                cursor: 'pointer',
                fontSize: '0.875rem',
                border: '1px solid #e4d8c9'
              }}
            >
              <input
                type="radio"
                value={option.id}
                {...register('currency')}
                defaultChecked={selectedCurrency === option.id}
              />
              <span>{option.label}</span>
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: selectedOwnerType === OwnerType.MEMBER ? 6 : 12 }}>
        <TextField
          fullWidth
          label="¿De quién es?"
          select
          {...register('ownerType')}
          defaultValue={selectedOwnerType}
        >
          <MenuItem value={OwnerType.HOUSEHOLD}>Del hogar</MenuItem>
          <MenuItem value={OwnerType.MEMBER}>De un integrante</MenuItem>
        </TextField>
      </Grid>
      {selectedOwnerType === OwnerType.MEMBER && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="ownerId"
            control={control}
            render={({ field }) => (
              <MemberOwnerField
                value={field.value ?? ''}
                onChange={field.onChange}
                error={Boolean(errors.ownerId)}
                helperText={errors.ownerId?.message}
              />
            )}
          />
        </Grid>
      )}
      {selectedType === AccountType.CREDIT_CARD ? (
        <>
          <Grid size={12}>
            <Controller
              name="sourceAccountId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="¿De qué cuenta sale la plata?"
                  select
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={Boolean(errors.sourceAccountId)}
                  helperText={
                    errors.sourceAccountId?.message ??
                    'Cuando pagues con esta tarjeta, se va a descontar de esta cuenta'
                  }
                >
                  {sourceAccountOptions.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Límite de la tarjeta"
              {...register('creditLimit', { valueAsNumber: true })}
              error={Boolean(errors.creditLimit)}
              helperText={errors.creditLimit?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Monto usado (opcional)"
              {...register('usedAmount', { valueAsNumber: true })}
              error={Boolean(errors.usedAmount)}
              helperText={errors.usedAmount?.message ?? 'Cuánto llevás gastado en el ciclo actual'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Día de cierre"
              {...register('closingDay', { valueAsNumber: true })}
              error={Boolean(errors.closingDay)}
              helperText={errors.closingDay?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Día de vencimiento"
              {...register('dueDay', { valueAsNumber: true })}
              error={Boolean(errors.dueDay)}
              helperText={errors.dueDay?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Próximo día de cierre (opcional)"
              {...register('nextClosingDay', { valueAsNumber: true })}
              error={Boolean(errors.nextClosingDay)}
              helperText={
                errors.nextClosingDay?.message ??
                'Si sabés que el día de cierre cambia el próximo ciclo, cargalo acá'
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Próximo día de vencimiento (opcional)"
              {...register('nextDueDay', { valueAsNumber: true })}
              error={Boolean(errors.nextDueDay)}
              helperText={
                errors.nextDueDay?.message ??
                'Se va a aplicar solo cuando pase el próximo vencimiento'
              }
            />
          </Grid>
        </>
      ) : (
        <Grid size={{ xs: 12, sm: 6 }}>
          <NumberField
            fullWidth
            label="Saldo actual"
            {...register('balance', { valueAsNumber: true })}
            error={Boolean(errors.balance)}
            helperText={errors.balance?.message}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Color de la cuenta
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="input"
                  type="color"
                  value={field.value ?? '#7a4a23'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    field.onChange(event.target.value)
                  }
                  sx={{
                    width: 44,
                    height: 44,
                    padding: 0,
                    border: '1px solid #e4d8c9',
                    cursor: 'pointer',
                    backgroundColor: 'transparent'
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Se usa para distinguir esta cuenta o tarjeta
                </Typography>
              </Box>
            </Box>
          )}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Frase de contexto (opcional)"
          placeholder="Ej: Acá entra la jubilación todos los días 11"
          {...register('contextPhrase')}
        />
      </Grid>
    </Grid>
  )
}

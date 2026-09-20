import { Controller, useWatch } from 'react-hook-form'
import { FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  AccountType,
  AmountMode,
  CategoryKind,
  OwnerType,
  PaymentFrequency,
  PaymentKind
} from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { resolveFrequencyLabel } from '@/utils/domain/resolveFrequencyLabel'
import { computeNextClosingDate } from '@/utils/domain/computeNextClosingDate'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import { CategoryField } from '@/components/shared/CategoryField'
import { NumberField } from '@/components/shared/NumberField'
import { parseAmountInput } from '@/utils/formatting/parseAmountInput'
import type { PaymentFormFieldsProps } from '../typings/props'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

export function PaymentFormFields({
  register,
  control,
  setValue,
  errors,
  selectedOwnerType,
  isRecurring,
  kind,
  selectedAmountMode,
  hasInstallments,
  onToggleInstallments
}: PaymentFormFieldsProps): React.JSX.Element {
  const accounts = useAppSelector(selectAllAccounts)
  const isDeposit = kind === PaymentKind.DEPOSIT
  const categoryKind = isDeposit ? CategoryKind.INCOME : CategoryKind.EXPENSE
  const selectedAccountId = useWatch({ control, name: 'accountId' })
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)
  const isCardPayment = selectedAccount?.type === AccountType.CREDIT_CARD
  const nextClosingDate =
    isCardPayment && selectedAccount?.closingDay
      ? computeNextClosingDate(selectedAccount.closingDay, new Date())
      : null
  const installmentsTotal = useWatch({ control, name: 'installmentsTotal' })
  const installmentsPaid = useWatch({ control, name: 'installmentsPaid' })
  const installmentsRemaining =
    typeof installmentsTotal === 'number'
      ? Math.max(installmentsTotal - (installmentsPaid ?? 0), 0)
      : null

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Concepto"
          placeholder="Ej: Luz — Edesur"
          {...register('concept')}
          error={Boolean(errors.concept)}
          helperText={errors.concept?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Entidad"
          placeholder="Ej: Edesur S.A."
          {...register('entity')}
          error={Boolean(errors.entity)}
          helperText={errors.entity?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label={isDeposit ? '¿A qué cuenta entra?' : '¿Con qué cuenta se paga?'}
              select
              value={field.value ?? ''}
              onChange={(event) => {
                field.onChange(event)
                const nextAccount = accounts.find((account) => account.id === event.target.value)
                if (nextAccount?.type === AccountType.CREDIT_CARD) {
                  setValue('dueDate', TODAY_ISO)
                }
              }}
              onBlur={field.onBlur}
              error={Boolean(errors.accountId)}
              helperText={errors.accountId?.message}
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <CategoryField
              kind={categoryKind}
              label="Categoría"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={Boolean(errors.categoryId)}
              helperText={errors.categoryId?.message}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: selectedOwnerType === OwnerType.MEMBER ? 6 : 12 }}>
        <Controller
          name="ownerType"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              label="¿De quién es?"
              select
              value={field.value}
              onChange={field.onChange}
            >
              <MenuItem value={OwnerType.HOUSEHOLD}>Del hogar</MenuItem>
              <MenuItem value={OwnerType.MEMBER}>De un integrante</MenuItem>
            </TextField>
          )}
        />
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
      <Grid size={{ xs: 12, sm: isRecurring ? 6 : 12 }}>
        <FormControlLabel
          control={<Switch defaultChecked={isRecurring} {...register('recurring')} />}
          label="Se repite todos los meses"
        />
      </Grid>
      {isRecurring && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Frecuencia"
                select
                value={field.value ?? ''}
                onChange={field.onChange}
              >
                {Object.values(PaymentFrequency).map((frequency) => (
                  <MenuItem key={frequency} value={frequency}>
                    {resolveFrequencyLabel(frequency)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label={
            isCardPayment
              ? 'Fecha en que se agrega'
              : isDeposit
                ? 'Próximo ingreso'
                : 'Próximo vencimiento'
          }
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('dueDate')}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate?.message}
        />
      </Grid>
      {nextClosingDate && (
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary">
            Se va a pagar el {nextClosingDate}, según el día de cierre de la tarjeta.
          </Typography>
        </Grid>
      )}
      {isDeposit && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="amountMode"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="El monto es"
                select
                value={field.value}
                onChange={field.onChange}
              >
                <MenuItem value={AmountMode.FIXED}>Fijo, siempre el mismo</MenuItem>
                <MenuItem value={AmountMode.VARIABLE}>Variable, cambia cada vez</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      )}
      {isDeposit && selectedAmountMode === AmountMode.VARIABLE ? (
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary">
            Vas a cargar el monto cuando llegue el depósito.
          </Typography>
        </Grid>
      ) : (
        <Grid size={{ xs: 12, sm: 6 }}>
          <NumberField
            fullWidth
            label="Monto"
            {...register('amount', { setValueAs: parseAmountInput })}
            error={Boolean(errors.amount)}
            helperText={errors.amount?.message}
          />
        </Grid>
      )}
      <Grid size={12}>
        <FormControlLabel
          control={
            <Switch
              checked={hasInstallments}
              onChange={(event) => onToggleInstallments(event.target.checked)}
            />
          }
          label="¿Es en cuotas?"
        />
      </Grid>
      {hasInstallments && (
        <>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Cantidad total de cuotas"
              {...register('installmentsTotal', { setValueAs: parseAmountInput })}
              error={Boolean(errors.installmentsTotal)}
              helperText={errors.installmentsTotal?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Cuotas ya pagadas"
              {...register('installmentsPaid', { setValueAs: parseAmountInput })}
              error={Boolean(errors.installmentsPaid)}
              helperText={errors.installmentsPaid?.message}
            />
          </Grid>
          {installmentsRemaining != null && (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary">
                Quedan {installmentsRemaining} cuota{installmentsRemaining === 1 ? '' : 's'}.
              </Typography>
            </Grid>
          )}
        </>
      )}
    </Grid>
  )
}

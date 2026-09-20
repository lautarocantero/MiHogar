import { Controller } from 'react-hook-form'
import { FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DebtDirection, OwnerType, PaymentFrequency } from '@/typings/domain/enums'
import { resolveFrequencyLabel } from '@/utils/domain/resolveFrequencyLabel'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import { NumberField } from '@/components/shared/NumberField'
import { parseAmountInput } from '@/utils/formatting/parseAmountInput'
import type { DebtFormFieldsProps } from '../typings/props'

export function DebtFormFields({
  register,
  control,
  errors,
  selectedOwnerType,
  hasInstallments,
  onToggleInstallments
}: DebtFormFieldsProps): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="direction"
          control={control}
          render={({ field }) => (
            <TextField fullWidth label="Tipo" select value={field.value} onChange={field.onChange}>
              <MenuItem value={DebtDirection.OWED_BY_HOUSEHOLD}>La debemos nosotros</MenuItem>
              <MenuItem value={DebtDirection.OWED_TO_HOUSEHOLD}>Nos la deben a nosotros</MenuItem>
            </TextField>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Nombre"
          placeholder="Ej: Préstamo personal"
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="¿Con quién es?"
          placeholder="Ej: Banco Nación, Juan Pérez"
          {...register('counterparty')}
          error={Boolean(errors.counterparty)}
          helperText={errors.counterparty?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <NumberField
          fullWidth
          label="Monto original"
          {...register('principal', { setValueAs: parseAmountInput })}
          error={Boolean(errors.principal)}
          helperText={errors.principal?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <NumberField
          fullWidth
          label="Saldo pendiente"
          {...register('outstandingBalance', { setValueAs: parseAmountInput })}
          error={Boolean(errors.outstandingBalance)}
          helperText={errors.outstandingBalance?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <NumberField
          fullWidth
          label="Tasa anual % (opcional)"
          {...register('rateAnnual', { setValueAs: parseAmountInput })}
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
      <Grid size={12}>
        <FormControlLabel
          control={
            <Switch
              checked={hasInstallments}
              onChange={(event) => onToggleInstallments(event.target.checked)}
            />
          }
          label="¿Se paga en cuotas?"
        />
      </Grid>
      {hasInstallments && (
        <>
          <Grid size={{ xs: 12, sm: 4 }}>
            <NumberField
              fullWidth
              label="Monto de la cuota"
              {...register('installmentAmount', { setValueAs: parseAmountInput })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <NumberField
              fullWidth
              label="Cantidad total de cuotas"
              {...register('installmentsTotal', { setValueAs: parseAmountInput })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <NumberField
              fullWidth
              label="Cuotas ya pagadas"
              {...register('installmentsPaid', { setValueAs: parseAmountInput })}
            />
          </Grid>
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Próximo vencimiento de cuota"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('nextInstallmentDate')}
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={<Switch defaultChecked {...register('reminderEnabled')} />}
              label="Avisarme cuando se acerque el vencimiento"
            />
          </Grid>
        </>
      )}
      <Grid size={12}>
        <TextField
          fullWidth
          label="Fecha de inicio (opcional)"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('startDate')}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Notas (opcional)"
          multiline
          minRows={2}
          {...register('notes')}
        />
      </Grid>
      {hasInstallments && (
        <Grid size={12}>
          <Typography variant="body2" color="text.secondary">
            El saldo pendiente y las cuotas se actualizan solos al registrar cada pago desde la
            lista.
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

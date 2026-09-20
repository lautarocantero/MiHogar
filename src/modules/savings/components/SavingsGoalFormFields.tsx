import { Controller } from 'react-hook-form'
import { MenuItem, Stack, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { OwnerType } from '@/typings/domain/enums'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import { NumberField } from '@/components/shared/NumberField'
import { GOAL_ICON_OPTIONS } from '../goalIcons'
import type { SavingsGoalFormFieldsProps } from '../typings/props'

export function SavingsGoalFormFields({
  register,
  control,
  errors,
  selectedOwnerType
}: SavingsGoalFormFieldsProps): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Nombre de la meta"
          placeholder="Ej: Viaje a la costa"
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <TextField fullWidth label="Ícono" select value={field.value} onChange={field.onChange}>
              {GOAL_ICON_OPTIONS.map(({ value, label, Icon }) => (
                <MenuItem key={value} value={value}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Icon fontSize="small" />
                    <span>{label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <NumberField
          fullWidth
          label="Monto objetivo"
          {...register('targetAmount', { valueAsNumber: true })}
          error={Boolean(errors.targetAmount)}
          helperText={errors.targetAmount?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <NumberField
          fullWidth
          label="Ya ahorrado para esta meta"
          {...register('currentAmount', { valueAsNumber: true })}
          error={Boolean(errors.currentAmount)}
          helperText={errors.currentAmount?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Fecha objetivo (opcional)"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('targetDate')}
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
    </Grid>
  )
}

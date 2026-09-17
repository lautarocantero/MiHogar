import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addSavingsFormSchema } from '@/validation/addSavingsFormSchema'
import { OwnerType } from '@/typings/domain/enums'
import { MemberOwnerField } from '@/components/shared/MemberOwnerField'
import { NumberField } from '@/components/shared/NumberField'
import type { AddSavingsFormProps } from '../typings/props'
import type { AddSavingsFormValues } from '../typings/types'

export function AddSavingsForm({
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: AddSavingsFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddSavingsFormValues>({
    resolver: zodResolver(addSavingsFormSchema),
    defaultValues: {
      name: '',
      principal: undefined,
      monthlyInterestEstimate: undefined,
      rateAnnual: undefined,
      maturityDate: '',
      liquidAnytime: true,
      ownerType: OwnerType.HOUSEHOLD,
      ownerId: ''
    }
  })

  const selectedOwnerType = watch('ownerType')
  const isLiquid = watch('liquidAnytime')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nombre"
              placeholder="Ej: Plazo fijo Banco Nación"
              {...register('name')}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Monto guardado"
              {...register('principal', { valueAsNumber: true })}
              error={Boolean(errors.principal)}
              helperText={errors.principal?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <NumberField
              fullWidth
              label="Interés estimado por mes (opcional)"
              {...register('monthlyInterestEstimate', { valueAsNumber: true })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: selectedOwnerType === OwnerType.MEMBER ? 6 : 12 }}>
            <TextField
              fullWidth
              label="¿De quién es?"
              select
              {...register('ownerType')}
              defaultValue={OwnerType.HOUSEHOLD}
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
          <Grid size={12}>
            <FormControlLabel
              control={<Switch defaultChecked {...register('liquidAnytime')} />}
              label="Podés sacarlo cuando quieras"
            />
          </Grid>
          {!isLiquid && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Fecha de vencimiento"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register('maturityDate')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <NumberField
                  fullWidth
                  label="Tasa anual (%)"
                  {...register('rateAnnual', { valueAsNumber: true })}
                />
              </Grid>
            </>
          )}
        </Grid>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Agregar el ahorro'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

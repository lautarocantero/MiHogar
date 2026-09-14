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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addSavingsFormSchema } from '@/validation/addSavingsFormSchema'
import { OwnerType } from '@/typings/domain/enums'
import { useAppSelector } from '@/store/hooks'
import { selectAllMembers } from '@/store/household/householdSelectors'
import type { AddSavingsFormProps } from '../typings/props'
import type { AddSavingsFormValues } from '../typings/types'

export function AddSavingsForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: AddSavingsFormProps): React.JSX.Element {
  const members = useAppSelector(selectAllMembers)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AddSavingsFormValues>({
    resolver: zodResolver(addSavingsFormSchema),
    defaultValues: {
      name: '',
      principal: 0,
      monthlyInterestEstimate: 0,
      rateAnnual: 0,
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
        <TextField
          label="Nombre"
          placeholder="Ej: Plazo fijo Banco Nación"
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <TextField
          label="Monto guardado"
          type="number"
          {...register('principal')}
          error={Boolean(errors.principal)}
          helperText={errors.principal?.message}
        />
        <TextField
          label="Interés estimado por mes (opcional)"
          type="number"
          {...register('monthlyInterestEstimate')}
        />
        <TextField
          label="¿De quién es?"
          select
          {...register('ownerType')}
          defaultValue={OwnerType.HOUSEHOLD}
        >
          <MenuItem value={OwnerType.HOUSEHOLD}>Del hogar</MenuItem>
          <MenuItem value={OwnerType.MEMBER}>De un integrante</MenuItem>
        </TextField>
        {selectedOwnerType === OwnerType.MEMBER && (
          <TextField
            label="Integrante"
            select
            {...register('ownerId')}
            error={Boolean(errors.ownerId)}
            helperText={errors.ownerId?.message}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <FormControlLabel
          control={<Switch defaultChecked {...register('liquidAnytime')} />}
          label="Podés sacarlo cuando quieras"
        />
        {!isLiquid && (
          <>
            <TextField
              label="Fecha de vencimiento"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('maturityDate')}
            />
            <TextField label="Tasa anual (%)" type="number" {...register('rateAnnual')} />
          </>
        )}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Agregar el ahorro'}
        </Button>
      </Stack>
    </Box>
  )
}

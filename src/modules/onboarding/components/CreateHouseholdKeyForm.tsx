import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createHouseholdKeyFormSchema } from '@/validation/createHouseholdKeyFormSchema'
import type { CreateHouseholdKeyFormProps } from '../typings/props'
import type { CreateHouseholdKeyFormValues } from '../typings/types'

export function CreateHouseholdKeyForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: CreateHouseholdKeyFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateHouseholdKeyFormValues>({
    resolver: zodResolver(createHouseholdKeyFormSchema),
    defaultValues: { householdKey: '', confirmHouseholdKey: '' }
  })

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="create-household-key-title"
    >
      <Stack spacing={3}>
        <Typography id="create-household-key-title" variant="h4" component="h1">
          Creá la clave del hogar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Esta clave protege todos tus datos. Es una sola, para todo el hogar. Guardala en un lugar
          seguro: si la olvidás, no vamos a poder recuperar la información.
        </Typography>
        <TextField
          label="Clave del hogar"
          type="password"
          autoComplete="new-password"
          {...register('householdKey')}
          error={Boolean(errors.householdKey)}
          helperText={errors.householdKey?.message}
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        <TextField
          label="Repetí la clave"
          type="password"
          autoComplete="new-password"
          {...register('confirmHouseholdKey')}
          error={Boolean(errors.confirmHouseholdKey)}
          helperText={errors.confirmHouseholdKey?.message}
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Creando…' : 'Crear la clave y empezar'}
        </Button>
      </Stack>
    </Box>
  )
}

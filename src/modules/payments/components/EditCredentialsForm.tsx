import { Alert, Box, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editCredentialsFormSchema } from '@/validation/editCredentialsFormSchema'
import type { EditCredentialsFormProps } from '../typings/props'
import type { EditCredentialsFormValues } from '../typings/types'

export function EditCredentialsForm({
  payment,
  onSubmit,
  isSubmitting,
  errorMessage
}: EditCredentialsFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditCredentialsFormValues>({
    resolver: zodResolver(editCredentialsFormSchema),
    defaultValues: {
      username: payment.credentials?.username ?? '',
      password: payment.credentials?.password ?? '',
      clientNumber: payment.credentials?.clientNumber ?? '',
      providerUrl: payment.providerUrl ?? ''
    }
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField label="Usuario" {...register('username')} />
        <TextField label="Contraseña" {...register('password')} />
        <TextField label="Número de cliente" {...register('clientNumber')} />
        <TextField
          label="Sitio web para pagar"
          placeholder="https://www.edesur.com.ar"
          {...register('providerUrl')}
          error={Boolean(errors.providerUrl)}
          helperText={errors.providerUrl?.message}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar los datos de acceso'}
        </Button>
      </Stack>
    </Box>
  )
}

import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unlockFormSchema } from '@/validation/unlockFormSchema'
import { PasswordField } from '@/components/shared/PasswordField'
import type { UnlockFormProps } from '../typings/props'
import type { UnlockFormValues } from '../typings/types'

export function UnlockForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: UnlockFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UnlockFormValues>({
    resolver: zodResolver(unlockFormSchema),
    defaultValues: { householdKey: '' }
  })

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="unlock-title"
    >
      <Stack spacing={3}>
        <Typography id="unlock-title" variant="h4" component="h1">
          Ingresá la clave del hogar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Es la misma clave para todo: entrar a la aplicación y ver los datos guardados de cada
          pago.
        </Typography>
        <PasswordField
          label="Clave del hogar"
          autoComplete="current-password"
          autoFocus
          {...register('householdKey')}
          error={Boolean(errors.householdKey)}
          helperText={errors.householdKey?.message}
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </Stack>
    </Box>
  )
}

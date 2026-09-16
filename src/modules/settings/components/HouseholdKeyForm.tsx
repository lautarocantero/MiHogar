import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { changeHouseholdKeyFormSchema } from '@/validation/changeHouseholdKeyFormSchema'
import { PasswordField } from '@/components/shared/PasswordField'
import type { HouseholdKeyFormProps } from '../typings/props'
import type { ChangeHouseholdKeyFormValues } from '../typings/types'

export function HouseholdKeyForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  successMessage
}: HouseholdKeyFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ChangeHouseholdKeyFormValues>({
    resolver: yupResolver(changeHouseholdKeyFormSchema),
    defaultValues: { currentKey: '', newKey: '', confirmNewKey: '' }
  })

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((values) => {
        onSubmit(values)
        reset()
      })}
      noValidate
    >
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          Esta clave protege todos los datos guardados. Cambiarla no borra nada, solo actualiza con
          qué contraseña se abre la aplicación.
        </Typography>
        <PasswordField
          label="Clave actual"
          {...register('currentKey')}
          error={Boolean(errors.currentKey)}
          helperText={errors.currentKey?.message}
        />
        <PasswordField
          label="Clave nueva"
          {...register('newKey')}
          error={Boolean(errors.newKey)}
          helperText={errors.newKey?.message}
        />
        <PasswordField
          label="Repetila"
          {...register('confirmNewKey')}
          error={Boolean(errors.confirmNewKey)}
          helperText={errors.confirmNewKey?.message}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar la clave'}
        </Button>
      </Stack>
    </Box>
  )
}

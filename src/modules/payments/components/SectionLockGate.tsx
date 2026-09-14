import { Alert, Box, Button, Card, Stack, TextField, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unlockFormSchema } from '@/validation/unlockFormSchema'
import { organicColors } from '@/theme/tokens'
import type { UnlockCredentialsFormValues } from '../typings/types'
import type { SectionLockGateProps } from '../typings/props'

export function SectionLockGate({
  isUnlocked,
  onSubmit,
  onHide,
  isVerifying,
  errorMessage,
  children
}: SectionLockGateProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UnlockCredentialsFormValues>({
    resolver: zodResolver(unlockFormSchema),
    defaultValues: { householdKey: '' }
  })

  if (isUnlocked) {
    return (
      <Stack spacing={2}>
        {children}
        <Button variant="outlined" onClick={onHide}>
          Ocultar de nuevo
        </Button>
      </Stack>
    )
  }

  return (
    <Card sx={{ p: 3, backgroundColor: organicColors.orange.tint }} elevation={0}>
      <Stack spacing={2} alignItems="flex-start">
        <LockIcon sx={{ color: organicColors.orange.dark }} aria-hidden="true" />
        <Typography variant="h6" component="h3">
          Datos para entrar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por seguridad, estos datos están ocultos. Ingresá la clave del hogar para verlos.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate width="100%">
          <Stack spacing={2}>
            <TextField
              label="Clave del hogar"
              type="password"
              fullWidth
              {...register('householdKey')}
              error={Boolean(errors.householdKey)}
              helperText={errors.householdKey?.message}
            />
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Button type="submit" variant="contained" disabled={isVerifying}>
              {isVerifying ? 'Verificando…' : 'Mostrar los datos'}
            </Button>
            <Typography variant="caption" color="text.secondary">
              Si no la recordás, alguien más del hogar puede ayudarte desde Ajustes.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}

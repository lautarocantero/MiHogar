import { Alert, Box, Button, Card, Stack, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unlockFormSchema } from '@/validation/unlockFormSchema'
import { organicColors } from '@/theme/tokens'
import { PasswordField } from '@/components/shared/PasswordField'
import type { UnlockCredentialsFormValues } from '../typings/types'
import type { SectionLockGateProps } from '../typings/props'
import { useT } from '@/i18n'

export function SectionLockGate({
  isUnlocked,
  onSubmit,
  onHide,
  isVerifying,
  errorMessage,
  children
}: SectionLockGateProps): React.JSX.Element {
  const t = useT()
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
          {t('payments.credentials.hide')}
        </Button>
      </Stack>
    )
  }

  return (
    <Card sx={{ p: 3, backgroundColor: organicColors.orange.tint }} elevation={0}>
      <Stack spacing={2} alignItems="flex-start">
        <LockIcon sx={{ color: organicColors.orange.dark }} aria-hidden="true" />
        <Typography variant="h6" component="h3">
          {t('payments.credentials.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('payments.credentials.lockedDescription')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate width="100%">
          <Stack spacing={2}>
            <PasswordField
              label={t('payments.credentials.householdKey')}
              fullWidth
              {...register('householdKey')}
              error={Boolean(errors.householdKey)}
              helperText={errors.householdKey?.message && t(errors.householdKey.message)}
            />
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Button type="submit" variant="contained" disabled={isVerifying}>
              {isVerifying ? t('payments.credentials.verifying') : t('payments.credentials.show')}
            </Button>
            <Typography variant="caption" color="text.secondary">
              {t('payments.credentials.forgotHint')}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}

// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
import { Alert, Box, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newPasswordFormSchema } from '@/validation/authFormSchemas'
import { PasswordField } from '@/components/shared/PasswordField'
import { LeafButton } from '@/components/shared/LeafButton'
import { useT } from '@/i18n'
import type { NewPasswordFormProps } from '../typings/props'
import type { NewPasswordFormValues } from '../typings/types'

export function NewPasswordForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: NewPasswordFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: { password: '', confirmPassword: '' }
  })
  const { ref: passwordRef, ...passwordField } = register('password')
  const { ref: confirmRef, ...confirmField } = register('confirmPassword')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="new-password-title"
    >
      <Stack spacing={2.5}>
        <Typography id="new-password-title" variant="h6" component="h2">
          {t('auth.newPassword.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('auth.newPassword.description')}
        </Typography>
        <PasswordField
          label={t('auth.newPassword.label')}
          autoComplete="new-password"
          autoFocus
          fullWidth
          inputRef={passwordRef}
          {...passwordField}
          error={Boolean(errors.password)}
          helperText={
            errors.password?.message ? t(errors.password.message) : t('auth.passwordHint')
          }
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        <PasswordField
          label={t('auth.confirmPasswordLabel')}
          autoComplete="new-password"
          fullWidth
          inputRef={confirmRef}
          {...confirmField}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : ' '}
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <LeafButton
          type="submit"
          size="large"
          fullWidth
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t('auth.newPassword.submitting') : t('auth.newPassword.submit')}
        </LeafButton>
      </Stack>
    </Box>
  )
}

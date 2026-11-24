// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
import { Alert, Box, Link, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordFormSchema } from '@/validation/authFormSchemas'
import { LeafButton } from '@/components/shared/LeafButton'
import { useT } from '@/i18n'
import type { ForgotPasswordFormProps } from '../typings/props'
import type { ForgotPasswordFormValues } from '../typings/types'

export function ForgotPasswordForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  defaultEmail,
  onGoToSignIn
}: ForgotPasswordFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: defaultEmail }
  })
  const { ref: emailRef, ...emailField } = register('email')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="forgot-password-title"
    >
      <Stack spacing={2.5}>
        <Typography id="forgot-password-title" variant="h6" component="h2">
          {t('auth.forgot.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('auth.forgot.description')}
        </Typography>
        <TextField
          label={t('auth.emailLabel')}
          type="email"
          autoComplete="email"
          autoFocus
          fullWidth
          inputRef={emailRef}
          {...emailField}
          error={Boolean(errors.email)}
          helperText={errors.email?.message ? t(errors.email.message) : ' '}
          slotProps={{
            htmlInput: { 'aria-required': true, inputMode: 'email', spellCheck: false }
          }}
        />
        <Alert severity="info">{t('auth.forgot.householdKeyNote')}</Alert>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <LeafButton
          type="submit"
          size="large"
          fullWidth
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t('auth.forgot.submitting') : t('auth.forgot.submit')}
        </LeafButton>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onGoToSignIn}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('auth.backToSignIn')}
        </Link>
      </Stack>
    </Box>
  )
}

import { Box, Link, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInFormSchema } from '@/validation/authFormSchemas'
import { PasswordField } from '@/components/shared/PasswordField'
import { LeafButton } from '@/components/shared/LeafButton'
import { FormErrorAlert } from '@/components/shared/FormErrorAlert'
import { useT } from '@/i18n'
import type { SignInFormProps } from '../typings/props'
import type { SignInFormValues } from '../typings/types'

export function SignInForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  defaultEmail,
  noticeMessage,
  onGoToSignUp,
  onGoToForgotPassword
}: SignInFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: defaultEmail, password: '' }
  })
  const { ref: emailRef, ...emailField } = register('email')
  const { ref: passwordRef, ...passwordField } = register('password')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="sign-in-title"
    >
      <Stack spacing={2.5}>
        <Typography id="sign-in-title" variant="h6" component="h2">
          {t('auth.signIn.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('auth.signIn.description')}
        </Typography>
        <FormErrorAlert message={noticeMessage ?? null} severity="warning" />
        <TextField
          label={t('auth.emailLabel')}
          type="email"
          autoComplete="email"
          autoFocus={!defaultEmail}
          fullWidth
          inputRef={emailRef}
          {...emailField}
          error={Boolean(errors.email)}
          helperText={errors.email?.message ? t(errors.email.message) : ' '}
          slotProps={{
            htmlInput: { 'aria-required': true, inputMode: 'email', spellCheck: false }
          }}
        />
        <PasswordField
          label={t('auth.passwordLabel')}
          autoComplete="current-password"
          autoFocus={Boolean(defaultEmail)}
          fullWidth
          inputRef={passwordRef}
          {...passwordField}
          error={Boolean(errors.password)}
          helperText={errors.password?.message ? t(errors.password.message) : ' '}
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        <FormErrorAlert message={errorMessage} />
        <LeafButton
          type="submit"
          size="large"
          fullWidth
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t('auth.signIn.submitting') : t('auth.signIn.submit')}
        </LeafButton>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          {/* EMAILS DESACTIVADOS (todavía no hay envío de mails): el link solo aparece si
              la pantalla de recuperación está activa. */}
          {onGoToForgotPassword && (
            <Link component="button" type="button" variant="body2" onClick={onGoToForgotPassword}>
              {t('auth.signIn.forgotPassword')}
            </Link>
          )}
          <Link component="button" type="button" variant="body2" onClick={onGoToSignUp}>
            {t('auth.signIn.goToSignUp')}
          </Link>
        </Stack>
      </Stack>
    </Box>
  )
}

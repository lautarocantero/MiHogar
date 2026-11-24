import { Box, Link, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpFormSchema } from '@/validation/authFormSchemas'
import { PasswordField } from '@/components/shared/PasswordField'
import { LeafButton } from '@/components/shared/LeafButton'
import { FormErrorAlert } from '@/components/shared/FormErrorAlert'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { useT } from '@/i18n'
import type { SignUpFormProps } from '../typings/props'
import type { SignUpFormValues } from '../typings/types'

export function SignUpForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  defaultEmail,
  onGoToSignIn
}: SignUpFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { email: defaultEmail, password: '', confirmPassword: '' }
  })
  const { ref: emailRef, ...emailField } = register('email')
  const { ref: passwordRef, ...passwordField } = register('password')
  const { ref: confirmRef, ...confirmField } = register('confirmPassword')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="sign-up-title"
    >
      <Stack spacing={2.5}>
        <Typography id="sign-up-title" variant="h6" component="h2">
          {t('auth.signUp.title')}
        </Typography>
        <FormSectionHeader
          step={1}
          title={t('auth.signUp.stepTitle')}
          subtitle={t('auth.signUp.stepSubtitle')}
        />
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
        <PasswordField
          label={t('auth.passwordLabel')}
          autoComplete="new-password"
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
        <Typography variant="caption" color="text.secondary">
          {t('auth.signUp.twoKeysNote')}
        </Typography>
        <FormErrorAlert message={errorMessage} />
        <LeafButton
          type="submit"
          size="large"
          fullWidth
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t('auth.signUp.submitting') : t('auth.signUp.submit')}
        </LeafButton>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={onGoToSignIn}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('auth.signUp.goToSignIn')}
        </Link>
      </Stack>
    </Box>
  )
}

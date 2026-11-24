// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
import { AuthPageLayout } from './components/AuthPageLayout'
import { NewPasswordForm } from './components/NewPasswordForm'
import { AccountFooter } from './components/AccountFooter'
import { useResetPassword } from './useResetPassword'

/** Llegó desde el link de "restablecer contraseña": elige la contraseña nueva de la cuenta. */
export function ResetPasswordPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useResetPassword()

  return (
    <AuthPageLayout footer={<AccountFooter />}>
      <NewPasswordForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
    </AuthPageLayout>
  )
}

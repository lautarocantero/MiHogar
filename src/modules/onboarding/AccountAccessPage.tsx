import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAuthHasLinkError } from '@/store/auth/authSelectors'
import { authLinkErrorDismissed } from '@/store/auth/authSlice'
import { useT } from '@/i18n'
import { AuthPageLayout } from './components/AuthPageLayout'
import { SignInForm } from './components/SignInForm'
import { SignUpForm } from './components/SignUpForm'
// EMAILS DESACTIVADOS (todavía no hay envío de mails): reactivar junto con la confirmación de cuenta y
// la recuperación de contraseña por mail.
// import { ForgotPasswordForm } from './components/ForgotPasswordForm'
// import { EmailSentNotice } from './components/EmailSentNotice'
import { useSignIn } from './useSignIn'
import { useSignUp } from './useSignUp'
// import { useForgotPassword } from './useForgotPassword'
import { useEnterDemoMode } from './useEnterDemoMode'
import { AccountAccessScreen } from './typings/enums'

/** Sin sesión: entrar, crear cuenta o recuperar la contraseña de la cuenta. */
export function AccountAccessPage(): React.JSX.Element {
  const t = useT()
  const dispatch = useAppDispatch()
  const hasLinkError = useAppSelector(selectAuthHasLinkError)
  const [screen, setScreen] = useState(AccountAccessScreen.SIGN_IN)
  const [lastEmail, setLastEmail] = useState('')
  const signIn = useSignIn()
  const signUp = useSignUp()
  // const forgot = useForgotPassword()
  const { enterDemo, isEntering } = useEnterDemoMode()

  const goTo = (next: AccountAccessScreen): void => {
    if (hasLinkError) dispatch(authLinkErrorDismissed())
    // Los errores de una pantalla no tienen que seguir visibles al volver a ella.
    signIn.reset()
    signUp.reset()
    // forgot.resetSent()
    setScreen(next)
  }

  const renderContent = (): React.JSX.Element => {
    if (screen === AccountAccessScreen.SIGN_UP) {
      // EMAILS DESACTIVADOS (todavía no hay envío de mails): la cuenta se crea y entra de una.
      // if (signUp.pendingConfirmationEmail) {
      //   return (
      //     <EmailSentNotice
      //       title={t('auth.emailSent.confirmTitle')}
      //       description={t('auth.emailSent.confirmDescription', {
      //         email: signUp.pendingConfirmationEmail
      //       })}
      //       onBack={() => goTo(AccountAccessScreen.SIGN_IN)}
      //       onResend={signUp.resend}
      //       isResending={signUp.isResending}
      //       resendMessage={signUp.resendMessage}
      //       resendErrorMessage={signUp.resendErrorMessage}
      //     />
      //   )
      // }
      return (
        <SignUpForm
          onSubmit={(values) => {
            setLastEmail(values.email)
            signUp.submit(values)
          }}
          isSubmitting={signUp.isSubmitting}
          errorMessage={signUp.errorMessage}
          defaultEmail={lastEmail}
          onGoToSignIn={() => goTo(AccountAccessScreen.SIGN_IN)}
        />
      )
    }

    // EMAILS DESACTIVADOS (todavía no hay envío de mails): "olvidé mi contraseña" manda un mail.
    // if (screen === AccountAccessScreen.FORGOT_PASSWORD) {
    //   if (forgot.sentToEmail) {
    //     return (
    //       <EmailSentNotice
    //         title={t('auth.emailSent.resetTitle')}
    //         description={t('auth.emailSent.resetDescription', { email: forgot.sentToEmail })}
    //         onBack={() => goTo(AccountAccessScreen.SIGN_IN)}
    //       />
    //     )
    //   }
    //   return (
    //     <ForgotPasswordForm
    //       onSubmit={(values) => {
    //         setLastEmail(values.email)
    //         forgot.submit(values)
    //       }}
    //       isSubmitting={forgot.isSubmitting}
    //       errorMessage={forgot.errorMessage}
    //       defaultEmail={lastEmail}
    //       onGoToSignIn={() => goTo(AccountAccessScreen.SIGN_IN)}
    //     />
    //   )
    // }

    // EMAILS DESACTIVADOS: sin onGoToForgotPassword no se muestra "¿Olvidaste tu contraseña?".
    // Reactivar con: onGoToForgotPassword={() => goTo(AccountAccessScreen.FORGOT_PASSWORD)}
    return (
      <SignInForm
        onSubmit={(values) => {
          setLastEmail(values.email)
          // El aviso del link vencido ya cumplió: que no quede junto al error del login.
          if (hasLinkError) dispatch(authLinkErrorDismissed())
          signIn.submit(values)
        }}
        isSubmitting={signIn.isSubmitting}
        errorMessage={signIn.errorMessage}
        defaultEmail={lastEmail}
        noticeMessage={hasLinkError ? t('auth.linkExpired') : null}
        onGoToSignUp={() => goTo(AccountAccessScreen.SIGN_UP)}
      />
    )
  }

  return (
    <AuthPageLayout onDemoClick={enterDemo} isDemoLoading={isEntering}>
      {/* `key` remonta el formulario al cambiar de pantalla (foco y valores iniciales). */}
      <div key={screen}>{renderContent()}</div>
    </AuthPageLayout>
  )
}

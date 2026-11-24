import type { LocaleNamespace } from '../types'

/** Cuenta (Supabase Auth): entrar, registrarse, recuperar contraseña, cerrar sesión. */
export const auth = {
  es: {
    'auth.emailLabel': 'Email',
    'auth.passwordLabel': 'Contraseña de la cuenta',
    'auth.confirmPasswordLabel': 'Repetí la contraseña',
    'auth.passwordHint': 'Al menos 8 caracteres.',
    'auth.showPassword': 'Mostrar contraseña',
    'auth.hidePassword': 'Ocultar contraseña',
    'auth.backToSignIn': 'Volver a entrar',
    'auth.signOut': 'Cerrar sesión',
    'auth.signingOut': 'Cerrando sesión…',
    'auth.signedInAs': 'Conectado como {email}',
    'auth.useAnotherAccount': 'Cerrar sesión / usar otra cuenta',
    // EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails.
    'auth.emailResent': 'Te mandamos el email de nuevo.',
    'auth.linkExpired': 'El link ya no es válido. Entrá con tu email y contraseña.',

    'auth.signIn.title': 'Entrá a tu cuenta',
    'auth.signIn.description':
      'Con tu cuenta ves los datos del hogar desde la PC, la notebook o el celular.',
    'auth.signIn.submit': 'Entrar',
    'auth.signIn.submitting': 'Entrando…',
    'auth.signIn.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.signIn.goToSignUp': 'Crear una cuenta',

    'auth.signUp.title': 'Creá tu cuenta',
    'auth.signUp.stepTitle': 'Tu cuenta',
    'auth.signUp.stepSubtitle': 'Para entrar desde cualquier dispositivo',
    'auth.signUp.twoKeysNote':
      'Después vas a crear la clave del hogar: es otra clave, solo tuya, que cifra los datos antes de subirlos. Nadie más puede leerlos.',
    'auth.signUp.submit': 'Crear la cuenta',
    'auth.signUp.submitting': 'Creando…',
    'auth.signUp.goToSignIn': 'Ya tengo cuenta',

    // EMAILS DESACTIVADOS: auth.forgot.*, auth.newPassword.* y auth.emailSent.* sin uso por ahora.
    'auth.forgot.title': 'Recuperá tu contraseña',
    'auth.forgot.description':
      'Te mandamos un email con un link para elegir una contraseña nueva para tu cuenta.',
    'auth.forgot.householdKeyNote':
      'Esto cambia la contraseña de la cuenta, no la clave del hogar. La clave del hogar no se puede recuperar.',
    'auth.forgot.submit': 'Mandar el email',
    'auth.forgot.submitting': 'Mandando…',

    'auth.newPassword.title': 'Elegí una contraseña nueva',
    'auth.newPassword.description': 'Es la contraseña con la que entrás a tu cuenta.',
    'auth.newPassword.label': 'Contraseña nueva',
    'auth.newPassword.submit': 'Guardar la contraseña',
    'auth.newPassword.submitting': 'Guardando…',

    'auth.emailSent.confirmTitle': 'Revisá tu email',
    'auth.emailSent.confirmDescription':
      'Te mandamos un link a {email} para confirmar la cuenta. Abrilo y después entrá con tu email y contraseña.',
    'auth.emailSent.resetTitle': 'Revisá tu email',
    'auth.emailSent.resetDescription':
      'Si {email} tiene una cuenta, te llega un link para elegir una contraseña nueva.',
    'auth.emailSent.spamHint': '¿No te llegó? Fijate en la carpeta de spam o correo no deseado.',
    'auth.emailSent.resend': 'Mandar el email de nuevo',
    'auth.emailSent.resending': 'Mandando…',

    'auth.validation.emailRequired': 'Ingresá tu email',
    'auth.validation.emailInvalid': 'Ese email no parece válido',
    'auth.validation.passwordRequired': 'Ingresá tu contraseña',
    'auth.validation.passwordTooShort': 'La contraseña debe tener al menos 8 caracteres',
    'auth.validation.passwordTooLong': 'La contraseña puede tener hasta 72 caracteres',
    'auth.validation.passwordsDontMatch': 'Las contraseñas no coinciden',

    'auth.errors.invalidCredentials': 'El email o la contraseña no son correctos',
    'auth.errors.emailNotConfirmed':
      'Esta cuenta todavía no está activa. Por ahora no hay envío de mails para confirmarla: pedile al administrador que la active.',
    'auth.errors.userExists': 'Ya hay una cuenta con ese email. Probá entrar.',
    'auth.errors.weakPassword': 'Esa contraseña es muy débil. Probá con una más larga.',
    'auth.errors.samePassword': 'La contraseña nueva tiene que ser distinta de la anterior',
    'auth.errors.rateLimited': 'Demasiados intentos. Esperá unos minutos y volvé a probar.',
    'auth.errors.invalidEmail': 'Ese email no parece válido',
    'auth.errors.signupDisabled': 'Por ahora no se pueden crear cuentas nuevas',
    'auth.errors.signOutFailed': 'No se pudo cerrar la sesión',
    'auth.errors.confirmationRequired':
      'No se pudo activar la cuenta: el servidor pide confirmarla por mail y el envío de mails todavía no está activo.',
    'auth.errors.generic': 'Algo salió mal. Volvé a intentar en un rato.'
  },
  en: {
    'auth.emailLabel': 'Email',
    'auth.passwordLabel': 'Account password',
    'auth.confirmPasswordLabel': 'Repeat the password',
    'auth.passwordHint': 'At least 8 characters.',
    'auth.showPassword': 'Show password',
    'auth.hidePassword': 'Hide password',
    'auth.backToSignIn': 'Back to sign in',
    'auth.signOut': 'Sign out',
    'auth.signingOut': 'Signing out…',
    'auth.signedInAs': 'Signed in as {email}',
    'auth.useAnotherAccount': 'Sign out / use another account',
    // EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails.
    'auth.emailResent': 'We sent the email again.',
    'auth.linkExpired': 'That link is no longer valid. Sign in with your email and password.',

    'auth.signIn.title': 'Sign in to your account',
    'auth.signIn.description':
      'With your account you can see your household data from your PC, laptop or phone.',
    'auth.signIn.submit': 'Sign in',
    'auth.signIn.submitting': 'Signing in…',
    'auth.signIn.forgotPassword': 'Forgot your password?',
    'auth.signIn.goToSignUp': 'Create an account',

    'auth.signUp.title': 'Create your account',
    'auth.signUp.stepTitle': 'Your account',
    'auth.signUp.stepSubtitle': 'To sign in from any device',
    'auth.signUp.twoKeysNote':
      'Next you will create the household key: a separate key, only yours, that encrypts your data before it is uploaded. Nobody else can read it.',
    'auth.signUp.submit': 'Create account',
    'auth.signUp.submitting': 'Creating…',
    'auth.signUp.goToSignIn': 'I already have an account',

    // EMAILS DESACTIVADOS: auth.forgot.*, auth.newPassword.* y auth.emailSent.* sin uso por ahora.
    'auth.forgot.title': 'Reset your password',
    'auth.forgot.description':
      'We will email you a link to choose a new password for your account.',
    'auth.forgot.householdKeyNote':
      'This changes your account password, not the household key. The household key cannot be recovered.',
    'auth.forgot.submit': 'Send the email',
    'auth.forgot.submitting': 'Sending…',

    'auth.newPassword.title': 'Choose a new password',
    'auth.newPassword.description': 'This is the password you use to sign in to your account.',
    'auth.newPassword.label': 'New password',
    'auth.newPassword.submit': 'Save password',
    'auth.newPassword.submitting': 'Saving…',

    'auth.emailSent.confirmTitle': 'Check your email',
    'auth.emailSent.confirmDescription':
      'We sent a link to {email} to confirm your account. Open it and then sign in with your email and password.',
    'auth.emailSent.resetTitle': 'Check your email',
    'auth.emailSent.resetDescription':
      'If {email} has an account, you will get a link to choose a new password.',
    'auth.emailSent.spamHint': "Didn't get it? Check your spam or junk folder.",
    'auth.emailSent.resend': 'Send the email again',
    'auth.emailSent.resending': 'Sending…',

    'auth.validation.emailRequired': 'Enter your email',
    'auth.validation.emailInvalid': "That email doesn't look valid",
    'auth.validation.passwordRequired': 'Enter your password',
    'auth.validation.passwordTooShort': 'The password must be at least 8 characters long',
    'auth.validation.passwordTooLong': 'The password can be up to 72 characters long',
    'auth.validation.passwordsDontMatch': "The passwords don't match",

    'auth.errors.invalidCredentials': 'The email or password is incorrect',
    'auth.errors.emailNotConfirmed':
      'This account is not active yet. Email confirmation is not available for now: ask the administrator to activate it.',
    'auth.errors.userExists': 'There is already an account with that email. Try signing in.',
    'auth.errors.weakPassword': 'That password is too weak. Try a longer one.',
    'auth.errors.samePassword': 'The new password must be different from the old one',
    'auth.errors.rateLimited': 'Too many attempts. Wait a few minutes and try again.',
    'auth.errors.invalidEmail': "That email doesn't look valid",
    'auth.errors.signupDisabled': 'New accounts cannot be created right now',
    'auth.errors.signOutFailed': 'Could not sign out',
    'auth.errors.confirmationRequired':
      'The account could not be activated: the server requires email confirmation and email sending is not enabled yet.',
    'auth.errors.generic': 'Something went wrong. Please try again in a while.'
  }
} satisfies LocaleNamespace

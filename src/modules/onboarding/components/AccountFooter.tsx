import { Alert, Link, Stack, Typography } from '@mui/material'
import { useAppSelector } from '@/store/hooks'
import { selectAuthEmail } from '@/store/auth/authSelectors'
import { useSignOut } from '@/hooks/shared/useSignOut'
import { useT } from '@/i18n'

/** "Conectado como ..." + cerrar sesión, al pie de las pantallas del vault. */
export function AccountFooter(): React.JSX.Element | null {
  const email = useAppSelector(selectAuthEmail)
  const { signOut, isSigningOut, errorMessage } = useSignOut()
  const t = useT()

  if (!email) return null

  return (
    <Stack spacing={1}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.5, sm: 1 }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
          {t('auth.signedInAs', { email })}
        </Typography>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={signOut}
          disabled={isSigningOut}
          sx={{ flexShrink: 0 }}
        >
          {isSigningOut ? t('auth.signingOut') : t('auth.useAnotherAccount')}
        </Link>
      </Stack>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Stack>
  )
}

import { Alert, Button, Card, Stack, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAppSelector } from '@/store/hooks'
import { selectAuthEmail } from '@/store/auth/authSelectors'
import { useSignOut } from '@/hooks/shared/useSignOut'
import { useT } from '@/i18n'

export function AccountSettingsCard(): React.JSX.Element {
  const t = useT()
  const email = useAppSelector(selectAuthEmail)
  const { signOut, isSigningOut, errorMessage } = useSignOut()

  return (
    <Card
      sx={{ p: { xs: 2, sm: 3 } }}
      elevation={0}
      component="section"
      aria-labelledby="account-title"
    >
      <Stack spacing={2}>
        <Typography id="account-title" variant="h6" component="h2">
          {t('settingsCloud.account.title')}
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            {t('settingsCloud.account.emailLabel')}
          </Typography>
          <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
            {email ?? '—'}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t('settingsCloud.account.description')}
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={signOut}
          disabled={isSigningOut}
          aria-busy={isSigningOut}
          sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
        >
          {isSigningOut ? t('auth.signingOut') : t('auth.signOut')}
        </Button>
      </Stack>
    </Card>
  )
}

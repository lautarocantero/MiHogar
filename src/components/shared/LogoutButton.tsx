import { Button, Tooltip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useSignOut } from '@/hooks/shared/useSignOut'
import { useT } from '@/i18n'

type LogoutButtonProps = {
  collapsed?: boolean
}

export function LogoutButton({ collapsed = false }: LogoutButtonProps): React.JSX.Element {
  const { signOut, isSigningOut } = useSignOut()
  const t = useT()
  const label = isSigningOut ? t('auth.signingOut') : t('auth.signOut')

  const button = (
    <Button
      variant="outlined"
      startIcon={collapsed ? undefined : <LogoutIcon />}
      onClick={signOut}
      disabled={isSigningOut}
      aria-label={collapsed ? label : undefined}
      sx={{
        width: '100%',
        minHeight: 48,
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 0,
        borderColor: 'rgba(255,253,249,0.45)',
        color: 'rgba(255,253,249,0.95)',
        px: collapsed ? 0 : 2,
        '&:hover': {
          backgroundColor: 'rgba(255,253,249,0.12)',
          borderColor: 'rgba(255,253,249,0.45)'
        },
        '&.Mui-disabled': {
          color: 'rgba(255,253,249,0.6)',
          borderColor: 'rgba(255,253,249,0.3)'
        }
      }}
    >
      {collapsed ? <LogoutIcon fontSize="small" /> : label}
    </Button>
  )

  return collapsed ? (
    <Tooltip title={label} placement="right">
      {button}
    </Tooltip>
  ) : (
    button
  )
}

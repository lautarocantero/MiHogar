import { Button, Tooltip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAppDispatch } from '@/store/hooks'
import { lockVaultThunk } from '@/store/vault/vaultThunks'

type LogoutButtonProps = {
  collapsed?: boolean
}

export function LogoutButton({ collapsed = false }: LogoutButtonProps): React.JSX.Element {
  const dispatch = useAppDispatch()
  const label = 'Cerrar sesión'

  const button = (
    <Button
      variant="outlined"
      startIcon={collapsed ? undefined : <LogoutIcon />}
      onClick={() => dispatch(lockVaultThunk())}
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

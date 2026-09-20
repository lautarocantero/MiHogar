import { Button, Tooltip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAppSelector } from '@/store/hooks'
import { selectIsDemoMode } from '@/store/vault/vaultSelectors'
import { useExitDemoMode } from '@/hooks/shared/useExitDemoMode'

type DemoModeExitButtonProps = {
  collapsed?: boolean
}

export function DemoModeExitButton({
  collapsed = false
}: DemoModeExitButtonProps): React.JSX.Element | null {
  const isDemoMode = useAppSelector(selectIsDemoMode)
  const { exitDemo, isExiting } = useExitDemoMode()

  if (!isDemoMode) {
    return null
  }

  const label = isExiting ? 'Saliendo…' : 'Salir del demo'

  const button = (
    <Button
      variant="outlined"
      startIcon={collapsed ? undefined : <LogoutIcon />}
      onClick={exitDemo}
      disabled={isExiting}
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

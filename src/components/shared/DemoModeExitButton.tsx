import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAppSelector } from '@/store/hooks'
import { selectIsDemoMode } from '@/store/vault/vaultSelectors'
import { useExitDemoMode } from '@/hooks/shared/useExitDemoMode'
import { organicColors } from '@/theme/tokens'

export function DemoModeExitButton(): React.JSX.Element | null {
  const isDemoMode = useAppSelector(selectIsDemoMode)
  const { exitDemo, isExiting } = useExitDemoMode()

  if (!isDemoMode) {
    return null
  }

  return (
    <Button
      variant="contained"
      startIcon={<LogoutIcon />}
      onClick={exitDemo}
      disabled={isExiting}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: organicColors.orange.dark,
        boxShadow: 3
      }}
    >
      {isExiting ? 'Saliendo…' : 'Salir del demo'}
    </Button>
  )
}

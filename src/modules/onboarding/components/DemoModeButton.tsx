import { Button } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useT } from '@/i18n'
import type { DemoModeButtonProps } from '../typings/props'

export function DemoModeButton({ onClick, isLoading }: DemoModeButtonProps): React.JSX.Element {
  const t = useT()

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<VisibilityIcon />}
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      sx={{ backgroundColor: 'background.paper' }}
    >
      {isLoading ? t('common.loading') : t('onboarding.viewDemo')}
    </Button>
  )
}

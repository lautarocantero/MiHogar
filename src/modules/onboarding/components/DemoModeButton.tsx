import { Button } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { DemoModeButtonProps } from '../typings/props'

export function DemoModeButton({ onClick, isLoading }: DemoModeButtonProps): React.JSX.Element {
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<VisibilityIcon />}
      onClick={onClick}
      disabled={isLoading}
      sx={{ position: 'fixed', top: 24, right: 24, backgroundColor: 'background.default' }}
    >
      {isLoading ? 'Cargando…' : 'Ver demo'}
    </Button>
  )
}

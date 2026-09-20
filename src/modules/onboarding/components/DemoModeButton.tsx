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
      sx={{ backgroundColor: 'background.paper' }}
    >
      {isLoading ? 'Cargando…' : 'Ver demo'}
    </Button>
  )
}

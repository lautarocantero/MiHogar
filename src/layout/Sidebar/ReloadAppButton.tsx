import RefreshIcon from '@mui/icons-material/Refresh'
import { SidebarActionButton } from './SidebarActionButton'

type ReloadAppButtonProps = {
  collapsed?: boolean
}

export function ReloadAppButton({ collapsed = false }: ReloadAppButtonProps): React.JSX.Element {
  return (
    <SidebarActionButton
      collapsed={collapsed}
      action={{
        label: 'Recargar aplicación',
        icon: RefreshIcon,
        onClick: () => window.location.reload()
      }}
    />
  )
}

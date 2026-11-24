import RefreshIcon from '@mui/icons-material/Refresh'
import { useT } from '@/i18n'
import { SidebarActionButton } from './SidebarActionButton'

type ReloadAppButtonProps = {
  collapsed?: boolean
}

export function ReloadAppButton({ collapsed = false }: ReloadAppButtonProps): React.JSX.Element {
  const t = useT()
  return (
    <SidebarActionButton
      collapsed={collapsed}
      action={{
        label: t('layout.reloadApp'),
        icon: RefreshIcon,
        onClick: () => window.location.reload()
      }}
    />
  )
}

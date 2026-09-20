import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import type { SidebarActionButtonProps } from './typings/props'

export function SidebarActionButton({
  action,
  collapsed = false
}: SidebarActionButtonProps): React.JSX.Element {
  const Icon = action.icon

  const button = (
    <ListItemButton
      onClick={action.onClick}
      sx={{
        borderRadius: 0,
        minHeight: 48,
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 1.5 : 2,
        color: 'rgba(255,253,249,0.9)',
        '&:hover': { backgroundColor: 'rgba(255,253,249,0.10)' }
      }}
    >
      <ListItemIcon
        sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center', color: 'inherit' }}
      >
        <Icon aria-hidden="true" />
      </ListItemIcon>
      {!collapsed && (
        <ListItemText slotProps={{ primary: { fontSize: '1.0625rem' } }}>
          {action.label}
        </ListItemText>
      )}
    </ListItemButton>
  )

  return (
    <ListItem disablePadding>
      {collapsed ? (
        <Tooltip title={action.label} placement="right">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </ListItem>
  )
}

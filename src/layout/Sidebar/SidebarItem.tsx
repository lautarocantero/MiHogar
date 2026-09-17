import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { organicColors } from '@/theme/tokens'
import type { SidebarItemProps } from './typings/props'

export function SidebarItem({
  item,
  collapsed = false,
  onNavigate
}: SidebarItemProps): React.JSX.Element {
  const Icon = item.icon

  const button = (
    <ListItemButton
      component={NavLink}
      to={item.path}
      end={item.path === '/'}
      onClick={onNavigate}
      sx={{
        borderRadius: 999,
        mx: 1,
        minHeight: 48,
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 1.5 : 2,
        '&.active': {
          backgroundColor: organicColors.orange.tint,
          color: organicColors.orange.dark,
          '& .MuiListItemIcon-root': { color: organicColors.orange.dark }
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
        <Icon aria-hidden="true" />
      </ListItemIcon>
      {!collapsed && (
        <ListItemText slotProps={{ primary: { fontSize: '1.0625rem' } }}>{item.label}</ListItemText>
      )}
    </ListItemButton>
  )

  return (
    <ListItem disablePadding>
      {collapsed ? (
        <Tooltip title={item.label} placement="right">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </ListItem>
  )
}

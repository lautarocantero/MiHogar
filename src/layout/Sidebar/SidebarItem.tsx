import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { sidebarColors } from '@/theme/tokens'
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
        borderRadius: 0,
        minHeight: 48,
        justifyContent: collapsed ? 'center' : 'flex-start',
        px: collapsed ? 1.5 : 2,
        color: 'rgba(255,253,249,0.9)',
        '&:hover': { backgroundColor: 'rgba(255,253,249,0.10)' },
        '&.active': {
          backgroundColor: 'rgba(255,253,249,0.16)',
          color: sidebarColors.onDark,
          boxShadow: 'inset 0 0 0 1px rgba(255,253,249,0.14)',
          '& .MuiListItemIcon-root': { color: sidebarColors.onDark }
        }
      }}
    >
      <ListItemIcon
        sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center', color: 'inherit' }}
      >
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

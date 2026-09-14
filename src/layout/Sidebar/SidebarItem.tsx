import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { organicColors } from '@/theme/tokens'
import type { SidebarItemProps } from './typings/props'

export function SidebarItem({ item }: SidebarItemProps): React.JSX.Element {
  const Icon = item.icon

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NavLink}
        to={item.path}
        end={item.path === '/'}
        sx={{
          borderRadius: 999,
          mx: 1,
          minHeight: 48,
          '&.active': {
            backgroundColor: organicColors.orange.tint,
            color: organicColors.orange.dark,
            '& .MuiListItemIcon-root': { color: organicColors.orange.dark }
          }
        }}
      >
        <ListItemIcon>
          <Icon aria-hidden="true" />
        </ListItemIcon>
        <ListItemText slotProps={{ primary: { fontSize: '1.0625rem' } }}>{item.label}</ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

import { Divider, Drawer, List, Toolbar, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { ROUTES } from '@/router/routes'
import { organicColors } from '@/theme/tokens'
import { SidebarItem } from './SidebarItem'
import { useSidebarItems } from './useSidebarItems'

const SIDEBAR_WIDTH = 290
const SETTINGS_ITEM = { label: 'Ajustes y letra', path: ROUTES.SETTINGS, icon: SettingsIcon }

export function Sidebar(): React.JSX.Element {
  const items = useSidebarItems()

  return (
    <Drawer
      variant="permanent"
      component="nav"
      aria-label="Navegación principal"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderRight: `1px solid ${organicColors.neutral.border}`,
          backgroundColor: organicColors.surface
        }
      }}
    >
      <Toolbar>
        <Typography variant="h5" component="span" color="text.primary">
          Mi Hogar
        </Typography>
      </Toolbar>
      <List component="div" sx={{ flexGrow: 1 }}>
        {items.map((item) => (
          <SidebarItem key={item.path} item={item} />
        ))}
      </List>
      <Divider />
      <List component="div">
        <SidebarItem item={SETTINGS_ITEM} />
      </List>
    </Drawer>
  )
}

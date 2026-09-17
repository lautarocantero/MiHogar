import type { SidebarAction, SidebarItem } from './types'

export type SidebarItemProps = {
  item: SidebarItem
  collapsed?: boolean
  onNavigate?: () => void
}

export type SidebarActionButtonProps = {
  action: SidebarAction
  collapsed?: boolean
}

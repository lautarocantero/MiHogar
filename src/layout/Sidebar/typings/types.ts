import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'

export type SidebarItem = {
  label: string
  path: string
  icon: ComponentType<SvgIconProps>
}

export type SidebarAction = {
  label: string
  icon: ComponentType<SvgIconProps>
  onClick: () => void
}

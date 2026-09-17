import type { CategoryKind } from '@/typings/domain/enums'

export type MemberOwnerFieldProps = {
  value: string
  onChange: (memberId: string) => void
  error?: boolean
  helperText?: string
  label?: string
}

export type CategoryFieldProps = {
  kind: CategoryKind
  value: string
  onChange: (categoryId: string) => void
  error?: boolean
  helperText?: string
  label?: string
}

export type DialogHeaderProps = {
  id?: string
  onClose: () => void
  children: React.ReactNode
}

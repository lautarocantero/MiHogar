export type MemberOwnerFieldProps = {
  value: string
  onChange: (memberId: string) => void
  error?: boolean
  helperText?: string
  label?: string
}

export type DialogHeaderProps = {
  id?: string
  onClose: () => void
  children: React.ReactNode
}

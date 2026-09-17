import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

export function NumberField({
  slotProps,
  placeholder = '115077',
  ...props
}: TextFieldProps): React.JSX.Element {
  return (
    <TextField
      type="number"
      placeholder={placeholder}
      slotProps={{
        ...slotProps,
        htmlInput: { min: 0, ...slotProps?.htmlInput }
      }}
      {...props}
    />
  )
}

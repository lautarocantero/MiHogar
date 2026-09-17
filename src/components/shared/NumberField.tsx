import { forwardRef } from 'react'
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

export const NumberField = forwardRef<HTMLInputElement, TextFieldProps>(function NumberField(
  { slotProps, placeholder = '115077', ...props },
  ref
) {
  return (
    <TextField
      type="number"
      placeholder={placeholder}
      slotProps={{
        ...slotProps,
        htmlInput: { min: 0, ...slotProps?.htmlInput }
      }}
      inputRef={ref}
      {...props}
    />
  )
})

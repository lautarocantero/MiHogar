import { forwardRef } from 'react'
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'

function sanitizeAmountInput(raw: string): string {
  const withoutInvalidChars = raw.replace(/[^0-9,]/g, '')
  const firstCommaIndex = withoutInvalidChars.indexOf(',')
  if (firstCommaIndex === -1) {
    return withoutInvalidChars
  }
  return (
    withoutInvalidChars.slice(0, firstCommaIndex + 1) +
    withoutInvalidChars.slice(firstCommaIndex + 1).replace(/,/g, '')
  )
}

export const NumberField = forwardRef<HTMLInputElement, TextFieldProps>(function NumberField(
  { slotProps, placeholder = '115077', onChange, ...props },
  ref
) {
  return (
    <TextField
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      slotProps={slotProps}
      inputRef={ref}
      onChange={(event) => {
        const sanitized = sanitizeAmountInput(event.target.value)
        if (sanitized !== event.target.value) {
          event.target.value = sanitized
        }
        onChange?.(event)
      }}
      {...props}
    />
  )
})

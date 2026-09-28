import { createContext } from 'react'
import { DateFormat } from './typings/enums'
import type { DateFormatContextValue } from './typings/types'

export const DateFormatContext = createContext<DateFormatContextValue>({
  format: DateFormat.DMY,
  setFormat: () => {}
})

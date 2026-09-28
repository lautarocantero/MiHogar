import { useContext } from 'react'
import { DateFormatContext } from './DateFormatContext'
import type { DateFormatContextValue } from './typings/types'

export function useDateFormat(): DateFormatContextValue {
  return useContext(DateFormatContext)
}

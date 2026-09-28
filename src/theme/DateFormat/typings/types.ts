import type { DateFormat } from './enums'

export type DateFormatContextValue = {
  format: DateFormat
  setFormat: (format: DateFormat) => void
}

export type DateFormatPersistenceResult = DateFormatContextValue & {
  error: string | null
}

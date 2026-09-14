import { useCallback } from 'react'

export function useHandleError(): (error: unknown, fallbackMessage: string) => string {
  return useCallback((error: unknown, fallbackMessage: string): string => {
    console.error(error)
    if (error instanceof Error && error.message) {
      return error.message
    }
    return fallbackMessage
  }, [])
}

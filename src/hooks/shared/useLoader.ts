import { useCallback, useState } from 'react'
import { useHandleError } from './useHandleError'
import type { UseLoaderResult } from './typings/types'

export function useLoader(): UseLoaderResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleError = useHandleError()

  const run = useCallback(
    async <T>(action: () => Promise<T>, fallbackMessage: string): Promise<T | undefined> => {
      setIsLoading(true)
      setError(null)
      try {
        return await action()
      } catch (caughtError) {
        setError(handleError(caughtError, fallbackMessage))
        return undefined
      } finally {
        setIsLoading(false)
      }
    },
    [handleError]
  )

  return { isLoading, error, run }
}

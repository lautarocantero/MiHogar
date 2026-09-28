import { useCallback, useEffect, useState } from 'react'
import { getPreferences, setPreferences } from '@/apis/preferencesApi'
import { useLoader } from '@/hooks/shared/useLoader'

export function useGithubTokenPreference(): {
  token: string
  setToken: (token: string) => void
  isLoading: boolean
  errorMessage: string | null
} {
  const [token, setTokenState] = useState('')
  const { isLoading, error, run } = useLoader()

  useEffect(() => {
    run(getPreferences, 'No se pudo cargar el token de GitHub').then((preferences) => {
      if (preferences) {
        setTokenState(preferences.githubTasksToken ?? '')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setToken = useCallback(
    (nextToken: string) => {
      setTokenState(nextToken)
      run(async () => {
        const currentPreferences = await getPreferences()
        await setPreferences({ ...currentPreferences, githubTasksToken: nextToken || undefined })
      }, 'No se pudo guardar el token de GitHub')
    },
    [run]
  )

  return { token, setToken, isLoading, errorMessage: error }
}

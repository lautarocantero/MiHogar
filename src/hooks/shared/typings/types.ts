export type UseLoaderResult = {
  isLoading: boolean
  error: string | null
  run: <T>(action: () => Promise<T>, fallbackMessage: string) => Promise<T | undefined>
}

export type UseExitDemoModeResult = {
  exitDemo: () => void
  isExiting: boolean
}

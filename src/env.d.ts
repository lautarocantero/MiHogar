/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_TASKS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

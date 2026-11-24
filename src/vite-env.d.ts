/// <reference types="vite/client" />

/** Variables de entorno que lee el renderer (ver `.env.example`). */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

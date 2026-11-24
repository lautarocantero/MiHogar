import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './databaseTypes'
import { CloudConfigError } from './errors'

export type CloudClient = SupabaseClient<Database>

type SupabaseConfig = {
  url: string
  anonKey: string
}

/**
 * Se lee el hash ANTES de crear el cliente: supabase-js lo consume y lo borra al
 * procesar los links de confirmación / recuperación de contraseña.
 */
const INITIAL_LOCATION_HASH = typeof window !== 'undefined' ? window.location.hash : ''

function readSupabaseConfig(): SupabaseConfig | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) return null
  try {
    const parsed = new URL(url)
    // Producción: solo https (la CSP solo permite *.supabase.co). Un Supabase local por
    // http solo se acepta en desarrollo.
    const isLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    const isAllowedDevUrl = import.meta.env.DEV && isLocal && parsed.protocol === 'http:'
    if (parsed.protocol !== 'https:' && !isAllowedDevUrl) return null
  } catch {
    return null
  }
  return { url, anonKey }
}

export function isCloudConfigured(): boolean {
  return readSupabaseConfig() !== null
}

let client: CloudClient | null = null

export function getSupabase(): CloudClient {
  if (client) return client
  const config = readSupabaseConfig()
  if (!config) {
    throw new CloudConfigError()
  }
  client = createClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'mihogar.auth'
    }
  })
  return client
}

export type AuthRedirectState = {
  /** El usuario llegó desde el link de "restablecer contraseña". */
  isRecovery: boolean
  /** El link venció o es inválido (Supabase devuelve `#error=...`). */
  hasLinkError: boolean
}

export function readAuthRedirectState(): AuthRedirectState {
  const params = new URLSearchParams(INITIAL_LOCATION_HASH.replace(/^#\/?/, ''))
  return {
    isRecovery: params.get('type') === 'recovery',
    hasLinkError: params.has('error') || params.has('error_code')
  }
}

/**
 * Limpia un `#error=...` (o `#type=recovery`) de Supabase para que el router no lo interprete
 * como ruta.
 */
export function clearAuthErrorFromLocation(): void {
  if (typeof window === 'undefined') return
  // Acepta `#error=`, `#/error=` y el parámetro en cualquier posición (`&type=`).
  if (/(^#\/?|&)(error(_code)?|type)=/.test(window.location.hash)) {
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search
    )
  }
}

import type { VaultEnvelope } from '@shared/vaultEnvelope.types'

/** Tipos de las tablas de Supabase (ver `supabase/migrations/0001_init.sql`). */
export type VaultRow = {
  user_id: string
  envelope: VaultEnvelope
  version: number
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      vaults: {
        Row: VaultRow
        Insert: {
          user_id: string
          envelope: VaultEnvelope
          version?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          envelope?: VaultEnvelope
          version?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase is prepared but optional: without environment variables the app
 * runs fully offline and `getSupabaseClient` returns null.
 */
let client: SupabaseClient | null | undefined

function readSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  return url && anonKey ? { url, anonKey } : null
}

export function getSupabaseClient(): SupabaseClient | null {
  if (client === undefined) {
    const config = readSupabaseConfig()
    client = config ? createClient(config.url, config.anonKey) : null
  }
  return client
}

export function isSupabaseConfigured(): boolean {
  return readSupabaseConfig() !== null
}

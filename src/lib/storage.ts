/**
 * Small wrapper around localStorage that never throws.
 * Storage can be unavailable (private mode, blocked site data).
 */
const KEY_PREFIX = 'ellinika.'

export const STORAGE_KEYS = {
  theme: `${KEY_PREFIX}theme`,
  uiLanguage: `${KEY_PREFIX}uiLanguage`,
} as const

export function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Persisting is a convenience only; ignore failures.
  }
}

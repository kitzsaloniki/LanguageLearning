import { readStoredValue, STORAGE_KEYS, writeStoredValue } from '../lib/storage'

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const

export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export type ResolvedTheme = 'light' | 'dark'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Matches the `--color-bg` token per theme; used for the browser UI color. */
const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: '#f7f4ee',
  dark: '#14181d',
}

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value)
}

export function loadThemePreference(): ThemePreference {
  const stored = readStoredValue(STORAGE_KEYS.theme)
  return isThemePreference(stored) ? stored : 'system'
}

export function saveThemePreference(preference: ThemePreference): void {
  writeStoredValue(STORAGE_KEYS.theme, preference)
}

export function getSystemDarkQuery(): MediaQueryList {
  return window.matchMedia(DARK_QUERY)
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light'
  return preference
}

export function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

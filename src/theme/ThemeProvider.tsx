import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from './themeContext'
import {
  applyTheme,
  getSystemDarkQuery,
  loadThemePreference,
  resolveTheme,
  saveThemePreference,
  type ThemePreference,
} from './themePreference'

function useSystemPrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(() => getSystemDarkQuery().matches)

  useEffect(() => {
    const query = getSystemDarkQuery()
    const handleChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return prefersDark
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState(loadThemePreference)
  const systemPrefersDark = useSystemPrefersDark()
  const resolvedTheme = resolveTheme(preference, systemPrefersDark)

  useEffect(() => applyTheme(resolvedTheme), [resolvedTheme])

  const setPreference = useCallback((next: ThemePreference) => {
    saveThemePreference(next)
    setPreferenceState(next)
  }, [])

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

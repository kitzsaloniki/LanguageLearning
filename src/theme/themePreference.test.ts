import { describe, expect, it } from 'vitest'
import { resolveTheme } from './themePreference'

describe('resolveTheme', () => {
  it('follows the system setting for "system"', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('uses an explicit choice regardless of the system setting', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

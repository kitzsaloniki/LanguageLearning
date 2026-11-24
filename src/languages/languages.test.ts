import { describe, expect, it } from 'vitest'
import { isLanguageCode, toLanguageCode } from './languages'

describe('isLanguageCode', () => {
  it('accepts supported codes', () => {
    expect(isLanguageCode('el')).toBe(true)
  })

  it('rejects unsupported values', () => {
    expect(isLanguageCode('fr')).toBe(false)
    expect(isLanguageCode(undefined)).toBe(false)
  })
})

describe('toLanguageCode', () => {
  it('reduces regional tags to the base language', () => {
    expect(toLanguageCode('de-AT')).toBe('de')
    expect(toLanguageCode('EL-gr')).toBe('el')
  })

  it('returns undefined for unsupported tags', () => {
    expect(toLanguageCode('fr-FR')).toBeUndefined()
    expect(toLanguageCode(undefined)).toBeUndefined()
  })
})

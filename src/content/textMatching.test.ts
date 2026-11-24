import { describe, expect, it } from 'vitest'
import { containsWholeWord, isNormalizedNfc } from './textMatching'

describe('containsWholeWord', () => {
  it('finds whole words next to punctuation', () => {
    expect(containsWholeWord('Hallo! Ich bin Anna.', 'Hallo')).toBe(true)
    expect(containsWholeWord('Τι κάνεις;', 'Τι κάνεις')).toBe(true)
  })

  it('does not match inside a longer word', () => {
    expect(containsWholeWord('Die Katzen schlafen.', 'Katze')).toBe(false)
    expect(containsWholeWord('Το σπίτια', 'σπίτι')).toBe(false)
  })

  it('treats special characters in the surface literally', () => {
    expect(containsWholeWord("Wie geht's?", "geht's")).toBe(true)
  })
})

describe('isNormalizedNfc', () => {
  it('detects decomposed accents', () => {
    expect(isNormalizedNfc('ά')).toBe(true)
    expect(isNormalizedNfc('ά')).toBe(false)
  })
})

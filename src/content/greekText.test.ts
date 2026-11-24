import { describe, expect, it } from 'vitest'
import { findAccentIssues, findMixedScriptWords, hasValidDictionaryAccent } from './greekText'

describe('hasValidDictionaryAccent', () => {
  it('accepts words with exactly one accent', () => {
    expect(hasValidDictionaryAccent('θάλασσα')).toBe(true)
    expect(hasValidDictionaryAccent('ευχαριστώ')).toBe(true)
  })

  it('accepts one-syllable words without accent', () => {
    expect(hasValidDictionaryAccent('και')).toBe(true)
    expect(hasValidDictionaryAccent('γεια')).toBe(true)
  })

  it('rejects longer words without accent', () => {
    expect(hasValidDictionaryAccent('θαλασσα')).toBe(false)
  })

  it('rejects words with two accents', () => {
    expect(hasValidDictionaryAccent('θάλασσά')).toBe(false)
  })
})

describe('findAccentIssues', () => {
  it('ignores Latin words and reports Greek words only', () => {
    expect(findAccentIssues('Hallo καλημερα και καλησπέρα')).toEqual(['καλημερα'])
  })
})

describe('findMixedScriptWords', () => {
  it('finds a Latin "o" hidden in a Greek word', () => {
    expect(findMixedScriptWords('Το σπiτι')).toEqual(['σπiτι'])
  })

  it('accepts clean text', () => {
    expect(findMixedScriptWords('Το σπίτι is big')).toEqual([])
  })
})

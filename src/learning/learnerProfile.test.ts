import { beforeEach, describe, expect, it } from 'vitest'
import {
  listTargetLanguages,
  loadLearnerProfile,
  parseLearnerProfile,
  saveLearnerProfile,
  suggestTargetLanguage,
  withNativeLanguage,
  type LearnerProfile,
} from './learnerProfile'

const profile: LearnerProfile = { nativeLanguage: 'de', targetLanguage: 'el', level: 'A0' }

describe('parseLearnerProfile', () => {
  it('accepts a valid profile', () => {
    expect(parseLearnerProfile(profile)).toEqual(profile)
  })

  it('rejects identical native and target languages', () => {
    expect(parseLearnerProfile({ ...profile, targetLanguage: 'de' })).toBeNull()
  })

  it('rejects unknown languages and levels', () => {
    expect(parseLearnerProfile({ ...profile, nativeLanguage: 'fr' })).toBeNull()
    expect(parseLearnerProfile({ ...profile, level: 'C1' })).toBeNull()
  })
})

describe('profile storage', () => {
  beforeEach(() => window.localStorage.clear())

  it('returns null when nothing is stored', () => {
    expect(loadLearnerProfile()).toBeNull()
  })

  it('round-trips a saved profile', () => {
    saveLearnerProfile(profile)
    expect(loadLearnerProfile()).toEqual(profile)
  })

  it('ignores corrupt data', () => {
    window.localStorage.setItem('ellinika.learnerProfile', '{not json')
    expect(loadLearnerProfile()).toBeNull()
  })
})

describe('suggestTargetLanguage', () => {
  it('suggests Greek unless Greek is the native language', () => {
    expect(suggestTargetLanguage('de')).toBe('el')
    expect(suggestTargetLanguage('en')).toBe('el')
    expect(suggestTargetLanguage('el')).toBe('en')
  })
})

describe('listTargetLanguages', () => {
  it('excludes the native language', () => {
    expect(listTargetLanguages('en')).toEqual(['de', 'el'])
  })
})

describe('withNativeLanguage', () => {
  it('keeps the target language when there is no collision', () => {
    expect(withNativeLanguage(profile, 'en')).toEqual({ ...profile, nativeLanguage: 'en' })
  })

  it('swaps languages when the new native language is the target language', () => {
    expect(withNativeLanguage(profile, 'el')).toEqual({
      ...profile,
      nativeLanguage: 'el',
      targetLanguage: 'de',
    })
  })
})

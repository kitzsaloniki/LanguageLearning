import { describe, expect, it } from 'vitest'
import {
  chooseNativeLanguage,
  chooseUiLanguage,
  createInitialDraft,
  toLearnerProfile,
} from './onboardingDraft'

describe('createInitialDraft', () => {
  it('starts from the detected language at level A0', () => {
    expect(createInitialDraft('de')).toEqual({
      nativeLanguage: 'de',
      targetLanguage: 'el',
      uiLanguage: 'de',
      level: 'A0',
    })
  })
})

describe('chooseNativeLanguage', () => {
  it('moves the interface language along with the native language', () => {
    const draft = chooseUiLanguage(createInitialDraft('de'), 'en')
    expect(chooseNativeLanguage(draft, 'en').uiLanguage).toBe('en')
  })

  it('keeps a target language that does not collide', () => {
    const draft = { ...createInitialDraft('de'), targetLanguage: 'en' as const }
    expect(chooseNativeLanguage(draft, 'el').targetLanguage).toBe('en')
  })

  it('suggests a new target language on collision', () => {
    expect(chooseNativeLanguage(createInitialDraft('de'), 'el').targetLanguage).toBe('en')
  })
})

describe('toLearnerProfile', () => {
  it('drops the interface language', () => {
    expect(toLearnerProfile(createInitialDraft('en'))).toEqual({
      nativeLanguage: 'en',
      targetLanguage: 'el',
      level: 'A0',
    })
  })
})

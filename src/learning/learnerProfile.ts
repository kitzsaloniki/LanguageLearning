import { z } from 'zod'
import { CEFR_LEVELS, type CefrLevel } from '../content/cefr'
import { LANGUAGE_CODES, type LanguageCode } from '../languages/languages'
import { readStoredValue, STORAGE_KEYS, writeStoredValue } from '../lib/storage'

/**
 * What the learner told us during onboarding.
 * The interface/explanation language is stored separately by i18n.
 */
export interface LearnerProfile {
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
  level: CefrLevel
}

export const DEFAULT_LEVEL: CefrLevel = 'A0'

/** Greek is the app's focus, so it is suggested whenever it is not the native language. */
const PREFERRED_TARGET_LANGUAGES: readonly LanguageCode[] = ['el', 'en', 'de']

const learnerProfileSchema = z
  .object({
    nativeLanguage: z.enum(LANGUAGE_CODES),
    targetLanguage: z.enum(LANGUAGE_CODES),
    level: z.enum(CEFR_LEVELS),
  })
  .refine((profile) => profile.nativeLanguage !== profile.targetLanguage)

export function parseLearnerProfile(value: unknown): LearnerProfile | null {
  const result = learnerProfileSchema.safeParse(value)
  return result.success ? result.data : null
}

function parseJson(text: string | null): unknown {
  if (text === null) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function loadLearnerProfile(): LearnerProfile | null {
  return parseLearnerProfile(parseJson(readStoredValue(STORAGE_KEYS.learnerProfile)))
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  writeStoredValue(STORAGE_KEYS.learnerProfile, JSON.stringify(profile))
}

export function suggestTargetLanguage(nativeLanguage: LanguageCode): LanguageCode {
  return PREFERRED_TARGET_LANGUAGES.find((code) => code !== nativeLanguage)!
}

export function listTargetLanguages(nativeLanguage: LanguageCode): LanguageCode[] {
  return LANGUAGE_CODES.filter((code) => code !== nativeLanguage)
}

/**
 * Changes the native language. If it collides with the target language,
 * the two are swapped so the profile always stays valid.
 */
export function withNativeLanguage(
  profile: LearnerProfile,
  nativeLanguage: LanguageCode,
): LearnerProfile {
  const targetLanguage =
    profile.targetLanguage === nativeLanguage ? profile.nativeLanguage : profile.targetLanguage
  return { ...profile, nativeLanguage, targetLanguage }
}

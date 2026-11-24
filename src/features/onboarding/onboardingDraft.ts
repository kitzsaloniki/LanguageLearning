import type { CefrLevel } from '../../content/cefr'
import type { LanguageCode } from '../../languages/languages'
import {
  DEFAULT_LEVEL,
  suggestTargetLanguage,
  type LearnerProfile,
} from '../../learning/learnerProfile'

export const ONBOARDING_STEPS = ['native', 'target', 'interface', 'level'] as const

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]

/** Choices collected while the learner moves through onboarding. */
export interface OnboardingDraft extends LearnerProfile {
  uiLanguage: LanguageCode
}

export function createInitialDraft(detectedLanguage: LanguageCode): OnboardingDraft {
  return {
    nativeLanguage: detectedLanguage,
    targetLanguage: suggestTargetLanguage(detectedLanguage),
    uiLanguage: detectedLanguage,
    level: DEFAULT_LEVEL,
  }
}

/**
 * The interface language follows the native language by default.
 * The target language is re-suggested only if it would collide.
 */
export function chooseNativeLanguage(
  draft: OnboardingDraft,
  nativeLanguage: LanguageCode,
): OnboardingDraft {
  const targetLanguage =
    draft.targetLanguage === nativeLanguage
      ? suggestTargetLanguage(nativeLanguage)
      : draft.targetLanguage
  return { ...draft, nativeLanguage, targetLanguage, uiLanguage: nativeLanguage }
}

export function chooseTargetLanguage(
  draft: OnboardingDraft,
  targetLanguage: LanguageCode,
): OnboardingDraft {
  return { ...draft, targetLanguage }
}

export function chooseUiLanguage(
  draft: OnboardingDraft,
  uiLanguage: LanguageCode,
): OnboardingDraft {
  return { ...draft, uiLanguage }
}

export function chooseLevel(draft: OnboardingDraft, level: CefrLevel): OnboardingDraft {
  return { ...draft, level }
}

export function toLearnerProfile(draft: OnboardingDraft): LearnerProfile {
  const { nativeLanguage, targetLanguage, level } = draft
  return { nativeLanguage, targetLanguage, level }
}

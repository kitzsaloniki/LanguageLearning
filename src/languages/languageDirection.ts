import { LANGUAGE_CODES, type LanguageCode } from './languages'

/** A learning direction: from the learner's known language to the language they learn. */
export interface LanguageDirection {
  source: LanguageCode
  target: LanguageCode
}

/** All combinations of two different supported languages. */
export function listLanguageDirections(): LanguageDirection[] {
  return LANGUAGE_CODES.flatMap((source) =>
    LANGUAGE_CODES.filter((target) => target !== source).map((target) => ({ source, target })),
  )
}

export function reverseDirection(direction: LanguageDirection): LanguageDirection {
  return { source: direction.target, target: direction.source }
}

/**
 * Registry of all languages the app knows about.
 *
 * Every language can serve as interface language, explanation language,
 * native language and target language. Adding a language means adding an
 * entry here plus a locale file in `src/i18n/locales`.
 */
export const LANGUAGE_CODES = ['de', 'el', 'en'] as const

export type LanguageCode = (typeof LANGUAGE_CODES)[number]

export interface LanguageInfo {
  code: LanguageCode
  /** Name of the language written in the language itself (endonym). */
  nativeName: string
  script: 'latin' | 'greek'
}

export const LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  de: { code: 'de', nativeName: 'Deutsch', script: 'latin' },
  el: { code: 'el', nativeName: 'Ελληνικά', script: 'greek' },
  en: { code: 'en', nativeName: 'English', script: 'latin' },
}

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === 'string' && (LANGUAGE_CODES as readonly string[]).includes(value)
}

/** Reduces a BCP 47 tag such as "de-AT" to a supported code, if possible. */
export function toLanguageCode(tag: string | undefined): LanguageCode | undefined {
  const base = tag?.toLowerCase().split('-')[0]
  return isLanguageCode(base) ? base : undefined
}

import type { LanguageCode } from '../languages/languages'
import de from './locales/de.json'
import el from './locales/el.json'
import en from './locales/en.json'

/** English is the reference locale: all other locales must have the same keys. */
export type TranslationResource = typeof en

export const resources: Record<LanguageCode, { translation: TranslationResource }> = {
  de: { translation: de },
  el: { translation: el },
  en: { translation: en },
}

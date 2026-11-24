import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, LANGUAGE_CODES, type LanguageCode } from '../languages/languages'
import { STORAGE_KEYS } from '../lib/storage'
import { resources } from './resources'

function syncDocumentLanguage(language: string): void {
  document.documentElement.lang = language
}

export function initI18n(): typeof i18n {
  i18n.on('languageChanged', syncDocumentLanguage)

  void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: LANGUAGE_CODES,
      nonExplicitSupportedLngs: true,
      load: 'languageOnly',
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: STORAGE_KEYS.uiLanguage,
        caches: ['localStorage'],
      },
    })

  return i18n
}

export function changeUiLanguage(language: LanguageCode): Promise<unknown> {
  return i18n.changeLanguage(language)
}

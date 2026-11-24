import { useTranslation } from 'react-i18next'
import type { Choice } from '../components/ui/ChoiceList'
import { LANGUAGES, type LanguageCode } from './languages'

/**
 * Language choices titled with the endonym (so everyone finds their own)
 * and described with the name in the current interface language.
 */
export function useLanguageChoices(codes: readonly LanguageCode[]): Choice<LanguageCode>[] {
  const { t } = useTranslation()
  return codes.map((code) => {
    const title = LANGUAGES[code].nativeName
    const localizedName = t(`languages.${code}`)
    return {
      value: code,
      title,
      // Skip the description when it would only repeat the title.
      description: localizedName === title ? undefined : localizedName,
      lang: code,
    }
  })
}

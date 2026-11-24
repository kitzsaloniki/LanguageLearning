import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui/Card'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { changeUiLanguage } from '../../i18n/i18n'
import { LANGUAGE_CODES, LANGUAGES, toLanguageCode } from '../../languages/languages'
import styles from './SettingsPage.module.css'

/** Language names are shown as endonyms so everyone can find their own. */
const LANGUAGE_OPTIONS = LANGUAGE_CODES.map((code) => ({
  value: code,
  label: LANGUAGES[code].nativeName,
  lang: code,
}))

export function InterfaceLanguageSetting() {
  const { t, i18n } = useTranslation()
  const current = toLanguageCode(i18n.resolvedLanguage) ?? 'en'

  return (
    <Card title={t('settings.interfaceLanguage.title')}>
      <p className={styles.description}>{t('settings.interfaceLanguage.description')}</p>
      <SegmentedControl
        label={t('settings.interfaceLanguage.title')}
        options={LANGUAGE_OPTIONS}
        value={current}
        onChange={(language) => void changeUiLanguage(language)}
      />
    </Card>
  )
}

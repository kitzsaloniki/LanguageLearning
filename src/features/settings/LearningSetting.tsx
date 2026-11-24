import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui/Card'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { CEFR_LEVELS } from '../../content/cefr'
import { LANGUAGE_CODES, LANGUAGES, type LanguageCode } from '../../languages/languages'
import { listTargetLanguages, withNativeLanguage } from '../../learning/learnerProfile'
import { useLearnerProfile } from '../../learning/useLearnerProfile'
import styles from './SettingsPage.module.css'

function toLanguageOptions(codes: readonly LanguageCode[]) {
  return codes.map((code) => ({ value: code, label: LANGUAGES[code].nativeName, lang: code }))
}

const LEVEL_OPTIONS = CEFR_LEVELS.map((level) => ({ value: level, label: level }))

/** Native language, learning language and level chosen during onboarding. */
export function LearningSetting() {
  const { t } = useTranslation()
  const { profile, setProfile } = useLearnerProfile()
  if (!profile) return null

  return (
    <Card title={t('settings.learning.title')}>
      <div className={styles.fields}>
        <div className={styles.field}>
          <h3 className={styles.fieldLabel}>{t('settings.learning.nativeLanguage')}</h3>
          <SegmentedControl
            label={t('settings.learning.nativeLanguage')}
            options={toLanguageOptions(LANGUAGE_CODES)}
            value={profile.nativeLanguage}
            onChange={(language) => setProfile(withNativeLanguage(profile, language))}
          />
        </div>
        <div className={styles.field}>
          <h3 className={styles.fieldLabel}>{t('settings.learning.targetLanguage')}</h3>
          <SegmentedControl
            label={t('settings.learning.targetLanguage')}
            options={toLanguageOptions(listTargetLanguages(profile.nativeLanguage))}
            value={profile.targetLanguage}
            onChange={(targetLanguage) => setProfile({ ...profile, targetLanguage })}
          />
        </div>
        <div className={styles.field}>
          <h3 className={styles.fieldLabel}>{t('settings.learning.level')}</h3>
          <SegmentedControl
            label={t('settings.learning.level')}
            options={LEVEL_OPTIONS}
            value={profile.level}
            onChange={(level) => setProfile({ ...profile, level })}
          />
          <p className={styles.hint}>{t(`levels.${profile.level}.description`)}</p>
        </div>
      </div>
    </Card>
  )
}

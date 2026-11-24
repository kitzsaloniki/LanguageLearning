import { useTranslation } from 'react-i18next'
import { AppearanceSetting } from './AppearanceSetting'
import { InterfaceLanguageSetting } from './InterfaceLanguageSetting'
import styles from './SettingsPage.module.css'

export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('settings.title')}</h1>
      <InterfaceLanguageSetting />
      <AppearanceSetting />
    </div>
  )
}

import { useTranslation } from 'react-i18next'
import type { LearningMethod } from '../../learning/learningMethods'
import styles from './MethodBadge.module.css'

/** Shows which learning method is active, with a short explanation. */
export function MethodBadge({ method }: { method: LearningMethod }) {
  const { t } = useTranslation()

  return (
    <div className={styles.method}>
      <span className={styles.label}>{t('methods.label')}</span>
      <span className={styles.name}>{t(`methods.${method}.name`)}</span>
      <p className={styles.description}>{t(`methods.${method}.description`)}</p>
    </div>
  )
}

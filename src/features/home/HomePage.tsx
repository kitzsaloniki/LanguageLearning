import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui/Card'
import { MethodBadge } from '../../components/ui/MethodBadge'
import { LEARNING_METHODS } from '../../learning/learningMethods'
import { useLearnerProfile } from '../../learning/useLearnerProfile'
import styles from './HomePage.module.css'

function LearningSummary() {
  const { t } = useTranslation()
  const { profile } = useLearnerProfile()
  if (!profile) return null

  return (
    <p className={styles.summary}>
      {t('home.learningSummary', {
        language: t(`languages.${profile.targetLanguage}`),
        level: profile.level,
      })}
    </p>
  )
}

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{t('home.greeting')}</h1>
        <p className={styles.intro}>{t('home.intro')}</p>
        <LearningSummary />
      </div>

      <Card title={t('home.sessionTitle')}>
        <p className={styles.placeholder}>{t('home.sessionPlaceholder')}</p>
        <MethodBadge method="comprehensibleInput" />
      </Card>

      <h2 className={styles.sectionTitle}>{t('home.methodsTitle')}</h2>
      <div className={styles.methods}>
        {LEARNING_METHODS.map((method) => (
          <MethodBadge key={method} method={method} />
        ))}
      </div>
    </div>
  )
}

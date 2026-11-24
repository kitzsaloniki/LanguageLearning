import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router'
import { ROUTES } from '../../app/routes'
import { Button } from '../../components/ui/Button'
import { changeUiLanguage } from '../../i18n/i18n'
import { DEFAULT_LANGUAGE, toLanguageCode } from '../../languages/languages'
import { useLearnerProfile } from '../../learning/useLearnerProfile'
import {
  createInitialDraft,
  ONBOARDING_STEPS,
  toLearnerProfile,
  type OnboardingDraft,
} from './onboardingDraft'
import styles from './OnboardingPage.module.css'
import { OnboardingStepContent } from './OnboardingSteps'

function useInitialDraft(): OnboardingDraft {
  const { i18n } = useTranslation()
  const detected = toLanguageCode(i18n.resolvedLanguage) ?? DEFAULT_LANGUAGE
  return createInitialDraft(detected)
}

function StepProgress({ current, total }: { current: number; total: number }) {
  const { t } = useTranslation()
  return (
    <div className={styles.progress}>
      <span className={styles.progressLabel}>
        {t('onboarding.progress', { current: current + 1, total })}
      </span>
      <div className={styles.dots} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={index <= current ? `${styles.dot} ${styles.dotDone}` : styles.dot}
          />
        ))}
      </div>
    </div>
  )
}

/** Calm first-run flow: native language, target language, interface language, level. */
export function OnboardingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, setProfile } = useLearnerProfile()
  const initialDraft = useInitialDraft()
  const [draft, setDraft] = useState(initialDraft)
  const [stepIndex, setStepIndex] = useState(0)

  if (profile) return <Navigate to={ROUTES.home} replace />

  const step = ONBOARDING_STEPS[stepIndex]
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1

  function updateDraft(next: OnboardingDraft) {
    if (next.uiLanguage !== draft.uiLanguage) void changeUiLanguage(next.uiLanguage)
    setDraft(next)
  }

  function finish() {
    setProfile(toLearnerProfile(draft))
    navigate(ROUTES.home, { replace: true })
  }

  function goForward() {
    if (isLastStep) finish()
    else setStepIndex(stepIndex + 1)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>{t('app.name')}</span>
        <StepProgress current={stepIndex} total={ONBOARDING_STEPS.length} />
      </header>

      <main key={step} className={styles.step}>
        <OnboardingStepContent step={step} draft={draft} onChange={updateDraft} />
        {isLastStep && <p className={styles.hint}>{t('onboarding.changeLater')}</p>}
      </main>

      <footer className={styles.footer}>
        {stepIndex > 0 && (
          <Button variant="ghost" onClick={() => setStepIndex(stepIndex - 1)}>
            {t('onboarding.back')}
          </Button>
        )}
        <Button className={styles.next} onClick={goForward}>
          {isLastStep ? t('onboarding.finish') : t('onboarding.next')}
        </Button>
      </footer>
    </div>
  )
}

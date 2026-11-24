import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ChoiceList, type Choice } from '../../components/ui/ChoiceList'
import { CEFR_LEVELS, type CefrLevel } from '../../content/cefr'
import { LANGUAGE_CODES } from '../../languages/languages'
import { useLanguageChoices } from '../../languages/useLanguageChoices'
import { listTargetLanguages } from '../../learning/learnerProfile'
import {
  chooseLevel,
  chooseNativeLanguage,
  chooseTargetLanguage,
  chooseUiLanguage,
  type OnboardingDraft,
  type OnboardingStep,
} from './onboardingDraft'
import styles from './OnboardingPage.module.css'

interface StepProps {
  draft: OnboardingDraft
  onChange: (draft: OnboardingDraft) => void
}

function StepIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.intro}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </div>
  )
}

function NativeLanguageStep({ draft, onChange }: StepProps) {
  const { t } = useTranslation()
  const choices = useLanguageChoices(LANGUAGE_CODES)
  return (
    <>
      <StepIntro
        title={t('onboarding.native.title')}
        description={t('onboarding.native.description')}
      />
      <ChoiceList
        label={t('onboarding.native.title')}
        choices={choices}
        value={draft.nativeLanguage}
        onChange={(language) => onChange(chooseNativeLanguage(draft, language))}
      />
    </>
  )
}

function TargetLanguageStep({ draft, onChange }: StepProps) {
  const { t } = useTranslation()
  const choices = useLanguageChoices(listTargetLanguages(draft.nativeLanguage))
  return (
    <>
      <StepIntro
        title={t('onboarding.target.title')}
        description={t('onboarding.target.description')}
      />
      <ChoiceList
        label={t('onboarding.target.title')}
        choices={choices}
        value={draft.targetLanguage}
        onChange={(language) => onChange(chooseTargetLanguage(draft, language))}
      />
    </>
  )
}

function InterfaceLanguageStep({ draft, onChange }: StepProps) {
  const { t } = useTranslation()
  const choices = useLanguageChoices(LANGUAGE_CODES)
  return (
    <>
      <StepIntro
        title={t('onboarding.interface.title')}
        description={t('onboarding.interface.description')}
      />
      <ChoiceList
        label={t('onboarding.interface.title')}
        choices={choices}
        value={draft.uiLanguage}
        onChange={(language) => onChange(chooseUiLanguage(draft, language))}
      />
    </>
  )
}

function useLevelChoices(): Choice<CefrLevel>[] {
  const { t } = useTranslation()
  return CEFR_LEVELS.map((level) => ({
    value: level,
    badge: level,
    title: t(`levels.${level}.name`),
    description: t(`levels.${level}.description`),
  }))
}

function LevelStep({ draft, onChange }: StepProps) {
  const { t } = useTranslation()
  const choices = useLevelChoices()
  return (
    <>
      <StepIntro
        title={t('onboarding.level.title')}
        description={t('onboarding.level.description')}
      />
      <ChoiceList
        label={t('onboarding.level.title')}
        choices={choices}
        value={draft.level}
        onChange={(level) => onChange(chooseLevel(draft, level))}
      />
    </>
  )
}

const STEP_COMPONENTS: Record<OnboardingStep, (props: StepProps) => ReactNode> = {
  native: NativeLanguageStep,
  target: TargetLanguageStep,
  interface: InterfaceLanguageStep,
  level: LevelStep,
}

export function OnboardingStepContent({ step, ...props }: StepProps & { step: OnboardingStep }) {
  const StepComponent = STEP_COMPONENTS[step]
  return <StepComponent {...props} />
}

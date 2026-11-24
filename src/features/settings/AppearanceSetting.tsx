import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui/Card'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { THEME_PREFERENCES } from '../../theme/themePreference'
import { useTheme } from '../../theme/useTheme'

export function AppearanceSetting() {
  const { t } = useTranslation()
  const { preference, setPreference } = useTheme()

  const options = THEME_PREFERENCES.map((value) => ({
    value,
    label: t(`settings.appearance.${value}`),
  }))

  return (
    <Card title={t('settings.appearance.title')}>
      <SegmentedControl
        label={t('settings.appearance.title')}
        options={options}
        value={preference}
        onChange={setPreference}
      />
    </Card>
  )
}

import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { ROUTES } from '../../app/routes'
import styles from './BottomNav.module.css'
import { BookIcon, SettingsIcon } from './navIcons'

const NAV_ITEMS = [
  { to: ROUTES.home, labelKey: 'nav.home', Icon: BookIcon },
  { to: ROUTES.settings, labelKey: 'nav.settings', Icon: SettingsIcon },
] as const

function linkClassName({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className={styles.nav} aria-label={t('nav.label')}>
      {NAV_ITEMS.map(({ to, labelKey, Icon }) => (
        <NavLink key={to} to={to} end className={linkClassName}>
          <Icon className={styles.icon} />
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}

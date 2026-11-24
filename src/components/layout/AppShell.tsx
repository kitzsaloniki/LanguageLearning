import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import styles from './AppShell.module.css'
import { BottomNav } from './BottomNav'

export function AppShell() {
  const { t } = useTranslation()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>{t('app.name')}</span>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

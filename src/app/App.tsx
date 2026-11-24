import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppShell } from '../components/layout/AppShell'
import { HomePage } from '../features/home/HomePage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { ThemeProvider } from '../theme/ThemeProvider'
import { ROUTES } from './routes'

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.settings} element={<SettingsPage />} />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

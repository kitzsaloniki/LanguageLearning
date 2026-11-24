import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from '../components/layout/AppShell'
import { HomePage } from '../features/home/HomePage'
import { OnboardingPage } from '../features/onboarding/OnboardingPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { RequireLearnerProfile } from './RequireLearnerProfile'
import { ROUTES } from './routes'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.onboarding} element={<OnboardingPage />} />
      <Route element={<RequireLearnerProfile />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.settings} element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}

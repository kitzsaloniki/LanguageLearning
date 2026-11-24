import { Navigate, Outlet } from 'react-router'
import { useLearnerProfile } from '../learning/useLearnerProfile'
import { ROUTES } from './routes'

/** Sends first-time visitors to onboarding before they see the app. */
export function RequireLearnerProfile() {
  const { profile } = useLearnerProfile()
  return profile ? <Outlet /> : <Navigate to={ROUTES.onboarding} replace />
}

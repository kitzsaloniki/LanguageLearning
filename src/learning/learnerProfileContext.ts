import { createContext } from 'react'
import type { LearnerProfile } from './learnerProfile'

export interface LearnerProfileContextValue {
  /** `null` until the learner has finished onboarding. */
  profile: LearnerProfile | null
  setProfile: (profile: LearnerProfile) => void
}

export const LearnerProfileContext = createContext<LearnerProfileContextValue | null>(null)

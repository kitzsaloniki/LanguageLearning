import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { loadLearnerProfile, saveLearnerProfile, type LearnerProfile } from './learnerProfile'
import { LearnerProfileContext } from './learnerProfileContext'

export function LearnerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState(loadLearnerProfile)

  const setProfile = useCallback((next: LearnerProfile) => {
    saveLearnerProfile(next)
    setProfileState(next)
  }, [])

  const value = useMemo(() => ({ profile, setProfile }), [profile, setProfile])

  return <LearnerProfileContext.Provider value={value}>{children}</LearnerProfileContext.Provider>
}

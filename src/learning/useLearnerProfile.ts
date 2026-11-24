import { useContext } from 'react'
import { LearnerProfileContext, type LearnerProfileContextValue } from './learnerProfileContext'

export function useLearnerProfile(): LearnerProfileContextValue {
  const context = useContext(LearnerProfileContext)
  if (!context) throw new Error('useLearnerProfile must be used inside <LearnerProfileProvider>')
  return context
}

/** Learning methods the app can show to the learner while they are active. */
export const LEARNING_METHODS = ['comprehensibleInput', 'spacedRepetition', 'activeRecall'] as const

export type LearningMethod = (typeof LEARNING_METHODS)[number]

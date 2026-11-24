/**
 * CEFR levels the app teaches. A0 is an informal "absolute beginner" level
 * below A1 that the app uses for the very first steps.
 */
export const CEFR_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2'] as const

export type CefrLevel = (typeof CEFR_LEVELS)[number]

export function compareCefrLevels(a: CefrLevel, b: CefrLevel): number {
  return CEFR_LEVELS.indexOf(a) - CEFR_LEVELS.indexOf(b)
}

export function isAtOrBelowLevel(level: CefrLevel, maxLevel: CefrLevel): boolean {
  return compareCefrLevels(level, maxLevel) <= 0
}

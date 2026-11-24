/** Helpers for finding words inside sentences, independent of the script. */

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** True if `surface` appears in `text` as a whole word (not inside another word). */
export function containsWholeWord(text: string, surface: string): boolean {
  const pattern = new RegExp(`(?<![\\p{L}\\p{M}])${escapeRegExp(surface)}(?![\\p{L}\\p{M}])`, 'u')
  return pattern.test(text)
}

/** Splits text into word tokens (letters and combining marks only). */
export function tokenizeWords(text: string): string[] {
  return text.match(/[\p{L}\p{M}]+/gu) ?? []
}

export function isNormalizedNfc(text: string): boolean {
  return text === text.normalize('NFC')
}

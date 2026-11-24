/**
 * Checks for common mistakes in Greek text: missing or doubled accents and
 * Latin look-alike letters (e.g. a Latin "o" inside a Greek word).
 */
import { tokenizeWords } from './textMatching'

const GREEK_LETTER = /\p{Script=Greek}/u
const LATIN_LETTER = /\p{Script=Latin}/u
const ACCENTED_VOWEL = /[άέήίόύώΆΈΉΊΌΎΏΐΰ]/gu
const VOWEL_RUN = /[αεηιουωάέήίόύώϊϋΐΰ]+/giu

export function isGreekWord(word: string): boolean {
  return GREEK_LETTER.test(word)
}

/** A word that mixes Greek and Latin letters almost always contains a typo. */
export function mixesGreekAndLatin(word: string): boolean {
  return GREEK_LETTER.test(word) && LATIN_LETTER.test(word)
}

export function countAccents(word: string): number {
  return word.match(ACCENTED_VOWEL)?.length ?? 0
}

/**
 * Counts groups of adjacent vowels. A rough syllable count that treats
 * diphthongs like "ει" or "ου" as one group.
 */
export function countVowelGroups(word: string): number {
  return word.match(VOWEL_RUN)?.length ?? 0
}

/** Words with more than one vowel group need exactly one accent (dictionary forms). */
export function hasValidDictionaryAccent(word: string): boolean {
  const accents = countAccents(word)
  if (countVowelGroups(word) < 2) {
    return accents <= 1
  }
  return accents === 1
}

/** Returns the Greek words in `text` whose accent looks wrong for a dictionary form. */
export function findAccentIssues(text: string): string[] {
  return tokenizeWords(text).filter((word) => isGreekWord(word) && !hasValidDictionaryAccent(word))
}

export function findMixedScriptWords(text: string): string[] {
  return tokenizeWords(text).filter(mixesGreekAndLatin)
}

/**
 * Turns language-neutral content into what a learner sees for one direction,
 * e.g. "das Haus" -> "το σπίτι". Works the same for every language pair.
 */
import type { LanguageDirection } from '../languages/languageDirection'
import type { LanguageCode } from '../languages/languages'
import type { Gender, Sentence, SentenceVersion, Word, WordForm } from './schema'

const DEFINITE_ARTICLES: Partial<Record<LanguageCode, Record<Gender, string>>> = {
  de: { masculine: 'der', feminine: 'die', neuter: 'das' },
  el: { masculine: 'ο', feminine: 'η', neuter: 'το' },
}

/** Nominative singular definite article, if the language marks gender. */
export function getDefiniteArticle(language: LanguageCode, gender?: Gender): string | undefined {
  return gender ? DEFINITE_ARTICLES[language]?.[gender] : undefined
}

/** Dictionary form as learners should memorise it, with article for gendered nouns. */
export function formatWordForm(language: LanguageCode, form: WordForm): string {
  const article = getDefiniteArticle(language, form.gender)
  return article ? `${article} ${form.lemma}` : form.lemma
}

export interface WordSide {
  language: LanguageCode
  form: WordForm
  display: string
}

export interface WordPair {
  wordId: string
  source: WordSide
  target: WordSide
}

function toWordSide(word: Word, language: LanguageCode): WordSide | undefined {
  const form = word.forms[language]
  return form ? { language, form, display: formatWordForm(language, form) } : undefined
}

/** Both sides of a vocabulary card, or undefined if a language is missing. */
export function buildWordPair(word: Word, direction: LanguageDirection): WordPair | undefined {
  const source = toWordSide(word, direction.source)
  const target = toWordSide(word, direction.target)
  return source && target ? { wordId: word.id, source, target } : undefined
}

export interface SentencePair {
  sentenceId: string
  source: SentenceVersion
  target: SentenceVersion
}

export function buildSentencePair(
  sentence: Sentence,
  direction: LanguageDirection,
): SentencePair | undefined {
  const source = sentence.versions[direction.source]
  const target = sentence.versions[direction.target]
  return source && target ? { sentenceId: sentence.id, source, target } : undefined
}

/**
 * Integrity checks that go beyond the shape checks in `schema.ts`:
 * unique ids, valid references, complete translations, grammar data and
 * Greek spelling hints. Each check returns a list of readable issues.
 */
import { LANGUAGE_CODES, type LanguageCode } from '../languages/languages'
import { isAtOrBelowLevel } from './cefr'
import { findAccentIssues, findMixedScriptWords } from './greekText'
import type { ContentPack, LocalizedText, Sentence, Word } from './schema'
import { containsWholeWord, isNormalizedNfc } from './textMatching'

export interface ContentIssue {
  path: string
  message: string
}

/** Languages every piece of content must be available in. */
const REQUIRED_LANGUAGES: readonly LanguageCode[] = LANGUAGE_CODES

/** Languages whose nouns carry a grammatical gender. */
const GENDERED_LANGUAGES: readonly LanguageCode[] = ['de', 'el']

type ContentCheck = (pack: ContentPack) => ContentIssue[]

function issue(path: string, message: string): ContentIssue {
  return { path, message }
}

function findDuplicates(ids: string[]): string[] {
  const seen = new Set<string>()
  return ids.filter((id) => (seen.has(id) ? true : (seen.add(id), false)))
}

function missingLanguages(entries: Partial<Record<LanguageCode, unknown>>): LanguageCode[] {
  return REQUIRED_LANGUAGES.filter((language) => entries[language] === undefined)
}

function checkLanguagesComplete(path: string, entries: LocalizedText | object): ContentIssue[] {
  return missingLanguages(entries).map((language) => issue(path, `Missing language "${language}"`))
}

export const checkUniqueIds: ContentCheck = (pack) => {
  const groups = {
    topics: pack.topics,
    words: pack.words,
    sentences: pack.sentences,
    texts: pack.texts,
  }
  return Object.entries(groups).flatMap(([name, items]) =>
    findDuplicates(items.map((item) => item.id)).map((id) => issue(name, `Duplicate id "${id}"`)),
  )
}

export const checkTranslationsComplete: ContentCheck = (pack) => [
  ...pack.topics.flatMap((topic) => checkLanguagesComplete(`topics.${topic.id}.name`, topic.name)),
  ...pack.words.flatMap((word) => checkLanguagesComplete(`words.${word.id}.forms`, word.forms)),
  ...pack.words.flatMap(checkWordNotesComplete),
  ...pack.sentences.flatMap((sentence) =>
    checkLanguagesComplete(`sentences.${sentence.id}.versions`, sentence.versions),
  ),
  ...pack.texts.flatMap((text) => checkLanguagesComplete(`texts.${text.id}.title`, text.title)),
]

function checkWordNotesComplete(word: Word): ContentIssue[] {
  return Object.entries(word.forms).flatMap(([language, form]) =>
    form.note ? checkLanguagesComplete(`words.${word.id}.forms.${language}.note`, form.note) : [],
  )
}

export const checkReferences: ContentCheck = (pack) => {
  const topicIds = new Set(pack.topics.map((topic) => topic.id))
  const sentenceIds = new Set(pack.sentences.map((sentence) => sentence.id))
  const unknownTopic = (path: string, id: string) =>
    topicIds.has(id) ? [] : [issue(path, `Unknown topic "${id}"`)]
  return [
    ...pack.words.flatMap((word) =>
      word.topicIds.flatMap((id) => unknownTopic(`words.${word.id}`, id)),
    ),
    ...pack.texts.flatMap((text) =>
      text.topicIds.flatMap((id) => unknownTopic(`texts.${text.id}`, id)),
    ),
    ...pack.texts.flatMap((text) =>
      text.sentenceIds
        .filter((id) => !sentenceIds.has(id))
        .map((id) => issue(`texts.${text.id}`, `Unknown sentence "${id}"`)),
    ),
  ]
}

export const checkWordLinks: ContentCheck = (pack) => {
  const wordIds = new Set(pack.words.map((word) => word.id))
  return pack.sentences.flatMap((sentence) =>
    Object.entries(sentence.versions).flatMap(([language, version]) =>
      version.wordLinks.flatMap((link) => {
        const path = `sentences.${sentence.id}.versions.${language}`
        if (!wordIds.has(link.wordId)) return [issue(path, `Unknown word "${link.wordId}"`)]
        if (!containsWholeWord(version.text, link.surface)) {
          return [issue(path, `"${link.surface}" does not appear in "${version.text}"`)]
        }
        return []
      }),
    ),
  )
}

export const checkGrammaticalGender: ContentCheck = (pack) =>
  pack.words.flatMap((word) =>
    Object.entries(word.forms).flatMap(([language, form]) => {
      const path = `words.${word.id}.forms.${language}`
      const needsGender =
        word.partOfSpeech === 'noun' && GENDERED_LANGUAGES.includes(language as LanguageCode)
      if (needsGender && !form.gender) return [issue(path, 'Noun needs a gender')]
      if (!needsGender && form.gender)
        return [issue(path, 'Gender is only used for nouns in de/el')]
      return []
    }),
  )

/** Every word needs at least one example sentence that shows it in every language. */
export const checkExampleSentences: ContentCheck = (pack) =>
  pack.words
    .filter(
      (word) => !pack.sentences.some((sentence) => linksWordInAllLanguages(sentence, word.id)),
    )
    .map((word) =>
      issue(`words.${word.id}`, 'No example sentence links this word in every language'),
    )

function linksWordInAllLanguages(sentence: Sentence, wordId: string): boolean {
  return REQUIRED_LANGUAGES.every((language) =>
    sentence.versions[language]?.wordLinks.some((link) => link.wordId === wordId),
  )
}

/** Sentences inside a text must not be harder than the text itself. */
export const checkTextLevels: ContentCheck = (pack) => {
  const sentencesById = new Map(pack.sentences.map((sentence) => [sentence.id, sentence]))
  return pack.texts.flatMap((text) =>
    text.sentenceIds
      .map((id) => sentencesById.get(id))
      .filter((sentence) => sentence && !isAtOrBelowLevel(sentence.level, text.level))
      .map((sentence) =>
        issue(`texts.${text.id}`, `Sentence "${sentence?.id}" is above the text level`),
      ),
  )
}

export const checkGreekSpelling: ContentCheck = (pack) => [
  ...pack.words.flatMap((word) => {
    const { lemma = '', plural = '' } = word.forms.el ?? {}
    return findAccentIssues(`${lemma} ${plural}`).map((bad) =>
      issue(`words.${word.id}.forms.el`, `Accent looks wrong in "${bad}"`),
    )
  }),
  ...collectStrings(pack, 'pack').flatMap(([path, text]) =>
    findMixedScriptWords(text).map((bad) =>
      issue(path, `Mixed Greek and Latin letters in "${bad}"`),
    ),
  ),
]

export const checkUnicodeNormalization: ContentCheck = (pack) =>
  collectStrings(pack, 'pack')
    .filter(([, text]) => !isNormalizedNfc(text))
    .map(([path]) => issue(path, 'Text is not in Unicode NFC form'))

function collectStrings(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value))
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`))
  }
  return []
}

const CONTENT_CHECKS: ContentCheck[] = [
  checkUniqueIds,
  checkTranslationsComplete,
  checkReferences,
  checkWordLinks,
  checkGrammaticalGender,
  checkExampleSentences,
  checkTextLevels,
  checkGreekSpelling,
  checkUnicodeNormalization,
]

export function validateContentPack(pack: ContentPack): ContentIssue[] {
  return CONTENT_CHECKS.flatMap((check) => check(pack))
}

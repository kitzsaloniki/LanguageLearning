/**
 * Read-only lookups over a validated content pack. Screens use this instead
 * of reading the raw data, so the storage behind it can change later.
 */
import type { LanguageCode } from '../languages/languages'
import { isAtOrBelowLevel, type CefrLevel } from './cefr'
import type { ContentPack, ReadingText, Sentence, Topic, Word } from './schema'

export interface ContentLibrary {
  topics: readonly Topic[]
  getWord(id: string): Word | undefined
  getSentence(id: string): Sentence | undefined
  getText(id: string): ReadingText | undefined
  getWordsByTopic(topicId: string): Word[]
  getWordsUpToLevel(level: CefrLevel): Word[]
  getExampleSentences(wordId: string, languages: readonly LanguageCode[]): Sentence[]
  getTextsUpToLevel(level: CefrLevel): ReadingText[]
  getTextSentences(textId: string): Sentence[]
}

function indexById<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

function linksWordIn(
  sentence: Sentence,
  wordId: string,
  languages: readonly LanguageCode[],
): boolean {
  return languages.every((language) =>
    sentence.versions[language]?.wordLinks.some((link) => link.wordId === wordId),
  )
}

export function createContentLibrary(pack: ContentPack): ContentLibrary {
  const words = indexById(pack.words)
  const sentences = indexById(pack.sentences)
  const texts = indexById(pack.texts)

  return {
    topics: pack.topics,
    getWord: (id) => words.get(id),
    getSentence: (id) => sentences.get(id),
    getText: (id) => texts.get(id),
    getWordsByTopic: (topicId) => pack.words.filter((word) => word.topicIds.includes(topicId)),
    getWordsUpToLevel: (level) => pack.words.filter((word) => isAtOrBelowLevel(word.level, level)),
    getExampleSentences: (wordId, languages) =>
      pack.sentences.filter((sentence) => linksWordIn(sentence, wordId, languages)),
    getTextsUpToLevel: (level) => pack.texts.filter((text) => isAtOrBelowLevel(text.level, level)),
    getTextSentences: (textId) =>
      (texts.get(textId)?.sentenceIds ?? []).flatMap((id) => sentences.get(id) ?? []),
  }
}

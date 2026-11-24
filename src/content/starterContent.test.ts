import { describe, expect, it } from 'vitest'
import { LANGUAGE_CODES } from '../languages/languages'
import { listLanguageDirections } from '../languages/languageDirection'
import { getStarterLibrary, loadStarterPack } from './starterContent'
import { buildSentencePair, buildWordPair } from './wordDisplay'

describe('A0 starter pack', () => {
  it('passes all content checks', () => {
    expect(() => loadStarterPack()).not.toThrow()
  })

  it('has every word in every direction', () => {
    const { words } = loadStarterPack()
    const pairs = listLanguageDirections().flatMap((direction) =>
      words.map((word) => buildWordPair(word, direction)),
    )
    expect(pairs).not.toContain(undefined)
  })

  it('has every sentence in every direction', () => {
    const { sentences } = loadStarterPack()
    const pairs = listLanguageDirections().flatMap((direction) =>
      sentences.map((sentence) => buildSentencePair(sentence, direction)),
    )
    expect(pairs).not.toContain(undefined)
  })

  it('offers example sentences for each word in all languages', () => {
    const library = getStarterLibrary()
    const { words } = loadStarterPack()
    for (const word of words) {
      expect(library.getExampleSentences(word.id, LANGUAGE_CODES).length).toBeGreaterThan(0)
    }
  })

  it('groups words by topic and returns texts in sentence order', () => {
    const library = getStarterLibrary()
    expect(library.getWordsByTopic('food-drink').map((word) => word.id)).toContain('coffee')
    expect(library.getTextSentences('at-the-cafe')[0].versions.el?.text).toBe(
      'Η Άννα είναι στην καφετέρια.',
    )
    expect(library.getTextsUpToLevel('A0')).toHaveLength(2)
  })
})

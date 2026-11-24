import { describe, expect, it } from 'vitest'
import { listLanguageDirections } from '../languages/languageDirection'
import { createTestPack } from './testPack'
import { buildSentencePair, buildWordPair, formatWordForm, getDefiniteArticle } from './wordDisplay'

const [house] = createTestPack().words
const [sentence] = createTestPack().sentences

describe('getDefiniteArticle', () => {
  it('returns gendered articles for German and Greek', () => {
    expect(getDefiniteArticle('de', 'feminine')).toBe('die')
    expect(getDefiniteArticle('el', 'masculine')).toBe('ο')
  })

  it('returns nothing for English or words without gender', () => {
    expect(getDefiniteArticle('en', 'neuter')).toBeUndefined()
    expect(getDefiniteArticle('de')).toBeUndefined()
  })
})

describe('formatWordForm', () => {
  it('adds the article to nouns', () => {
    expect(formatWordForm('de', house.forms.de!)).toBe('das Haus')
    expect(formatWordForm('el', house.forms.el!)).toBe('το σπίτι')
    expect(formatWordForm('en', house.forms.en!)).toBe('house')
  })
})

describe('buildWordPair', () => {
  it.each(listLanguageDirections())('works for $source -> $target', (direction) => {
    const pair = buildWordPair(house, direction)
    expect(pair?.source.language).toBe(direction.source)
    expect(pair?.target.language).toBe(direction.target)
  })

  it('returns undefined when a language is missing', () => {
    const { el: _greek, ...forms } = house.forms
    expect(buildWordPair({ ...house, forms }, { source: 'de', target: 'el' })).toBeUndefined()
  })
})

describe('buildSentencePair', () => {
  it('pairs the two versions of a sentence', () => {
    const pair = buildSentencePair(sentence, { source: 'el', target: 'en' })
    expect(pair?.source.text).toBe('Το σπίτι είναι μεγάλο.')
    expect(pair?.target.text).toBe('The house is big.')
  })
})

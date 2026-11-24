import { describe, expect, it } from 'vitest'
import { createTestPack } from './testPack'
import { validateContentPack } from './validateContent'

function messagesOf(pack: ReturnType<typeof createTestPack>): string[] {
  return validateContentPack(pack).map((issue) => `${issue.path}: ${issue.message}`)
}

describe('validateContentPack', () => {
  it('accepts a valid pack', () => {
    expect(messagesOf(createTestPack())).toEqual([])
  })

  it('reports duplicate ids', () => {
    const pack = createTestPack()
    pack.words.push(structuredClone(pack.words[0]))
    expect(messagesOf(pack)).toContain('words: Duplicate id "house"')
  })

  it('reports missing translations', () => {
    const pack = createTestPack()
    delete pack.words[0].forms.el
    expect(messagesOf(pack)).toContain('words.house.forms: Missing language "el"')
  })

  it('reports unknown references', () => {
    const pack = createTestPack()
    pack.texts[0].sentenceIds.push('missing-sentence')
    pack.words[0].topicIds.push('space')
    expect(messagesOf(pack)).toEqual([
      'words.house: Unknown topic "space"',
      'texts.my-house: Unknown sentence "missing-sentence"',
    ])
  })

  it('reports word links that do not match the sentence', () => {
    const pack = createTestPack()
    pack.sentences[0].versions.de!.wordLinks[0].surface = 'Häuser'
    expect(messagesOf(pack)).toContain(
      'sentences.the-house-is-big.versions.de: "Häuser" does not appear in "Das Haus ist groß."',
    )
  })

  it('requires a gender for German and Greek nouns only', () => {
    const pack = createTestPack()
    delete pack.words[0].forms.de!.gender
    pack.words[0].forms.en!.gender = 'neuter'
    expect(messagesOf(pack)).toEqual([
      'words.house.forms.de: Noun needs a gender',
      'words.house.forms.en: Gender is only used for nouns in de/el',
    ])
  })

  it('requires an example sentence in every language', () => {
    const pack = createTestPack()
    pack.sentences[0].versions.en!.wordLinks = []
    expect(messagesOf(pack)).toContain(
      'words.house: No example sentence links this word in every language',
    )
  })

  it('reports sentences above the text level', () => {
    const pack = createTestPack()
    pack.sentences[0].level = 'B1'
    expect(messagesOf(pack)).toContain(
      'texts.my-house: Sentence "the-house-is-big" is above the text level',
    )
  })

  it('reports Greek accent and script mistakes', () => {
    const pack = createTestPack()
    pack.words[0].forms.el!.lemma = 'σπιτι'
    pack.topics[0].name.el = 'Σπiτι'
    expect(messagesOf(pack)).toEqual([
      'words.house.forms.el: Accent looks wrong in "σπιτι"',
      'pack.topics[0].name.el: Mixed Greek and Latin letters in "Σπiτι"',
    ])
  })

  it('reports text that is not NFC normalized', () => {
    const pack = createTestPack()
    pack.topics[0].name.el = 'Σπίτι'
    expect(messagesOf(pack)).toContain('pack.topics[0].name.el: Text is not in Unicode NFC form')
  })
})

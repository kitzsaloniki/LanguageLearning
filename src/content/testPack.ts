import type { ContentPack } from './schema'

/** A tiny, valid pack for unit tests. Tests copy and break it on purpose. */
export function createTestPack(): ContentPack {
  return {
    id: 'test-pack',
    topics: [{ id: 'home', name: { de: 'Zuhause', el: 'Σπίτι', en: 'Home' } }],
    words: [
      {
        id: 'house',
        partOfSpeech: 'noun',
        level: 'A0',
        topicIds: ['home'],
        forms: {
          de: { lemma: 'Haus', gender: 'neuter', plural: 'Häuser' },
          el: { lemma: 'σπίτι', gender: 'neuter', plural: 'σπίτια' },
          en: { lemma: 'house', plural: 'houses' },
        },
      },
    ],
    sentences: [
      {
        id: 'the-house-is-big',
        level: 'A0',
        versions: {
          de: { text: 'Das Haus ist groß.', wordLinks: [{ wordId: 'house', surface: 'Haus' }] },
          el: {
            text: 'Το σπίτι είναι μεγάλο.',
            wordLinks: [{ wordId: 'house', surface: 'σπίτι' }],
          },
          en: { text: 'The house is big.', wordLinks: [{ wordId: 'house', surface: 'house' }] },
        },
      },
    ],
    texts: [
      {
        id: 'my-house',
        level: 'A1',
        topicIds: ['home'],
        title: { de: 'Mein Haus', el: 'Το σπίτι μου', en: 'My house' },
        sentenceIds: ['the-house-is-big'],
      },
    ],
  }
}

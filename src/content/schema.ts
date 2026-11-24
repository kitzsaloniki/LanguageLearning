/**
 * Language-neutral content model.
 *
 * Content is stored as meaning units ("words", "sentences", "texts") that carry
 * one entry per language. There are no fixed language pairs: any language can be
 * the source and any other the target. The shapes are flat and reference each
 * other by id, so they map directly onto database tables later (e.g. Supabase).
 */
import { z } from 'zod'
import { LANGUAGE_CODES } from '../languages/languages'
import { CEFR_LEVELS } from './cefr'

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Ids use lowercase kebab-case')

const nonEmptyText = z.string().trim().min(1)

const languageCodeSchema = z.enum(LANGUAGE_CODES)

/** One text per language, e.g. a topic name or a word note. */
export const localizedTextSchema = z.partialRecord(languageCodeSchema, nonEmptyText)

/** Slot for a recorded or generated audio file. Empty until audio exists. */
export const audioRefSchema = z.object({
  src: nonEmptyText,
  speaker: nonEmptyText.optional(),
})

export const cefrLevelSchema = z.enum(CEFR_LEVELS)

export const PARTS_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'conjunction',
  'phrase',
] as const

export const partOfSpeechSchema = z.enum(PARTS_OF_SPEECH)

export const GENDERS = ['masculine', 'feminine', 'neuter'] as const

export const genderSchema = z.enum(GENDERS)

/** How a word is written in one language. */
export const wordFormSchema = z.object({
  /** Dictionary form without article (verbs: infinitive, Greek: 1st person singular). */
  lemma: nonEmptyText,
  /** Grammatical gender, for languages that have it (German and Greek nouns). */
  gender: genderSchema.optional(),
  plural: nonEmptyText.optional(),
  /** Hint about this form, written in each explanation language. */
  note: localizedTextSchema.optional(),
  audio: audioRefSchema.optional(),
})

/** A meaning unit with one form per language. */
export const wordSchema = z.object({
  id: idSchema,
  partOfSpeech: partOfSpeechSchema,
  level: cefrLevelSchema,
  topicIds: z.array(idSchema).min(1),
  forms: z.partialRecord(languageCodeSchema, wordFormSchema),
})

/** Marks where a word appears in a sentence, as it is written there. */
export const wordLinkSchema = z.object({
  wordId: idSchema,
  /** The inflected surface form exactly as it appears in the sentence text. */
  surface: nonEmptyText,
})

export const sentenceVersionSchema = z.object({
  text: nonEmptyText,
  wordLinks: z.array(wordLinkSchema),
  audio: audioRefSchema.optional(),
})

/** A sentence and its translations. Used as example sentence and inside texts. */
export const sentenceSchema = z.object({
  id: idSchema,
  level: cefrLevelSchema,
  versions: z.partialRecord(languageCodeSchema, sentenceVersionSchema),
})

/** A short reading text, built from sentences so translations stay aligned. */
export const readingTextSchema = z.object({
  id: idSchema,
  level: cefrLevelSchema,
  topicIds: z.array(idSchema).min(1),
  title: localizedTextSchema,
  sentenceIds: z.array(idSchema).min(1),
})

export const topicSchema = z.object({
  id: idSchema,
  name: localizedTextSchema,
})

export const contentPackSchema = z.object({
  id: idSchema,
  topics: z.array(topicSchema),
  words: z.array(wordSchema),
  sentences: z.array(sentenceSchema),
  texts: z.array(readingTextSchema),
})

export type LocalizedText = z.infer<typeof localizedTextSchema>
export type AudioRef = z.infer<typeof audioRefSchema>
export type PartOfSpeech = z.infer<typeof partOfSpeechSchema>
export type Gender = z.infer<typeof genderSchema>
export type WordForm = z.infer<typeof wordFormSchema>
export type Word = z.infer<typeof wordSchema>
export type WordLink = z.infer<typeof wordLinkSchema>
export type SentenceVersion = z.infer<typeof sentenceVersionSchema>
export type Sentence = z.infer<typeof sentenceSchema>
export type ReadingText = z.infer<typeof readingTextSchema>
export type Topic = z.infer<typeof topicSchema>
export type ContentPack = z.infer<typeof contentPackSchema>

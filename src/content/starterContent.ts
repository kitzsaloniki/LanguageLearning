/**
 * The A0 starter pack that ships with the app. Stored as JSON files that
 * mirror future database tables (topics, words, sentences, texts).
 */
import sentences from './packs/a0-starter/sentences.json'
import texts from './packs/a0-starter/texts.json'
import topics from './packs/a0-starter/topics.json'
import words from './packs/a0-starter/words.json'
import { createContentLibrary, type ContentLibrary } from './contentLibrary'
import { parseContentPack } from './loadContentPack'
import type { ContentPack } from './schema'

export const STARTER_PACK_ID = 'a0-starter'

export function loadStarterPack(): ContentPack {
  return parseContentPack({ id: STARTER_PACK_ID, topics, words, sentences, texts }, STARTER_PACK_ID)
}

let cachedLibrary: ContentLibrary | undefined

export function getStarterLibrary(): ContentLibrary {
  cachedLibrary ??= createContentLibrary(loadStarterPack())
  return cachedLibrary
}

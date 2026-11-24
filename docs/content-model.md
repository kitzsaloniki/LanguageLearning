# Content model

Learning content is stored **language-neutral**: each item is a meaning unit with
one entry per language. There are no fixed language pairs. Any supported language
can be the source and any other the target, so all six directions between German,
Greek and English work from the same data.

Code lives in `src/content/`, data in `src/content/packs/<pack-id>/`.

## Entities

| Entity     | What it is                                                   | Per-language data                           |
| ---------- | ------------------------------------------------------------ | ------------------------------------------- |
| `Topic`    | A theme such as "Food and drink"                             | `name`                                      |
| `Word`     | A meaning unit (e.g. "house"), with part of speech and level | `forms`: lemma, gender, plural, note, audio |
| `Sentence` | A sentence with its translations                             | `versions`: text, word links, audio         |
| `Text`     | A short reading text, an ordered list of sentence ids        | `title`                                     |

- **Levels** use CEFR (`A0`, `A1`, `A2`, `B1`, `B2`). A0 is the absolute-beginner start.
- **Gender** is stored for German and Greek nouns. Articles (`der/die/das`, `ο/η/το`)
  are derived from it, so they cannot drift out of sync.
- **Notes** belong to one language's form (e.g. a hint on Greek `γεια σου`), but are
  written in every explanation language, because the interface language is separate.
- **Word links** mark where a word appears in a sentence, using the inflected surface
  form (`μένουν` for `μένω`). Example sentences for a word are found through these
  links, and the reading mode will use them to make words tappable.
- **Texts** are built from sentences, so every sentence of a text stays aligned with
  its translations.
- **Audio** is an optional slot (`{ src, speaker? }`) on word forms and sentence
  versions. It is empty for now.

## Loading and validation

`parseContentPack(raw)` checks the shape with zod and then runs integrity checks
(`validateContent.ts`). Any problem throws a `ContentValidationError` that lists all
issues. The checks cover:

- unique ids and valid references (topics, sentences, words)
- complete translations in all supported languages
- word links that really appear in the sentence text
- gender for German and Greek nouns only
- at least one example sentence per word that links it in every language
- sentences in a text not harder than the text
- Greek spelling hints: exactly one accent on multi-syllable dictionary forms, no
  Latin look-alike letters inside Greek words
- Unicode NFC normalization everywhere

`npm test` runs these checks on the shipped A0 starter pack.

Screens should use `ContentLibrary` (`createContentLibrary`, `getStarterLibrary`) and the
helpers in `wordDisplay.ts` (`buildWordPair`, `buildSentencePair`) instead of reading
raw data.

## Moving to Supabase later

The JSON files already mirror tables: `topics`, `words`, `sentences`, `texts`, each with
a string id. Per-language maps can become `jsonb` columns or separate translation tables
(`word_forms`, `sentence_versions`). Rows from the database go through the same
`parseContentPack`, so the validation and the `ContentLibrary` interface stay the same.

## A0 starter pack

`packs/a0-starter` holds 4 topics, 43 words, 32 sentences and 2 short texts
("At the café", "I am Eleni"). To add content, edit the JSON files and run `npm test`.

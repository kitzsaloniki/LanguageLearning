# Ellinika

A calm language learning app (German, Greek, English). Read first, no pressure.

Every supported language can be both native and target language, and the interface
language is chosen independently of the learning language.

## Tech stack

- React + TypeScript, built with Vite
- Progressive Web App via `vite-plugin-pwa` (installable, works offline)
- i18n with `i18next` / `react-i18next` (interface in German, Greek, English)
- Supabase (client prepared, optional until backend features land)
- Vitest + Testing Library, oxlint, Prettier

## Getting started

```bash
npm install
npm run dev
```

Optional: copy `.env.example` to `.env.local` and add your Supabase URL and anon key.
Without them the app runs fully locally.

## Scripts

| Script                        | Purpose                                        |
| ----------------------------- | ---------------------------------------------- |
| `npm run dev`                 | Start the dev server                           |
| `npm run build`               | Type check and build for production            |
| `npm run preview`             | Serve the production build                     |
| `npm test`                    | Run unit and component tests                   |
| `npm run lint`                | Lint with oxlint                               |
| `npm run format`              | Format with Prettier                           |
| `npm run generate-pwa-assets` | Regenerate PWA icons from `public/favicon.svg` |

## Project structure

```
src/
  app/            App root and routes
  content/        Language-neutral learning content, loaders and validation
  components/     Shared UI (ui/) and layout (layout/) components
  features/       Screens grouped by feature (home, settings, ...)
  i18n/           i18next setup and locale files (en.json is the reference)
  languages/      Registry of supported languages
  learning/       Learning domain (methods, later scheduling and content)
  lib/            Infrastructure helpers (storage, Supabase)
  styles/         Design tokens and base styles
  theme/          Light/dark theme handling
```

## Conventions

- No hardcoded UI text: every string lives in `src/i18n/locales/*.json`.
  A test ensures all locales have the same keys as `en.json`.
- Components use semantic design tokens from `src/styles/tokens.css`, never raw colors.
- Inter is the UI font, Literata the reading font (`.reading-text`); both cover Greek.
- Code, comments, commits and technical docs are written in English.
- Prefer small, focused functions and descriptive names.
- Learning content is language-neutral and validated by tests, see
  [docs/content-model.md](docs/content-model.md).

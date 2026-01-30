# Red Rebels Calendar

Nea Salamina sports calendar built with React + TypeScript + Vite.

## Fixtures Scraper

The project includes a scraper that fetches football and volleyball fixtures from multiple sources and syncs them into the app's event data.

### Sources

| Sport | Primary Source | Verification Source |
|-------|---------------|-------------------|
| Football | [cfa.com.cy](https://cfa.com.cy) | - |
| Volleyball | [volleyball.org.cy](https://volleyball.org.cy) | [kop-web.dataproject.com](https://kop-web.dataproject.com) |

### Usage

```bash
npx tsx scripts/scraper/index.ts
```

This will:

1. Scrape CFA football fixtures for Nea Salamina
2. Scrape volleyball.org.cy for men's and women's volleyball fixtures
3. Fetch dataproject as a secondary source and cross-verify volleyball fixtures
4. Sync results into `src/data/events.ts` and save raw data to `cfa_fixtures.json`

### Sync behaviour

The scraper uses a **sync mode** that preserves manual edits:

- Existing events that match a scraped fixture get their score, time, and status updated
- Existing events with no matching scraped fixture are **preserved** (they were added manually)
- New scraped fixtures that don't match any existing event are added
- Non-sport events (meetings, etc.) are never touched

### Team logos

Volleyball team logos are PNG files stored in `public/images/team_logos/` and named with the team's Greek name (e.g. `ΑΠΟΕΛ.png`, `ΑΕ ΚΑΡΑΒΑ.png`). The scraper looks up logos by exact filename, falling back to an underscore-based safe name for CFA football logos.

## Development

```bash
npm install
npm run dev
```

## Vite Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

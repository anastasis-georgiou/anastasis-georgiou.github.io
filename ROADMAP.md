# Red Rebels Calendar Migration Roadmap

## Overview

Migration from vanilla HTML/CSS/JS (Bootstrap) to **React + Vite + TypeScript + Tailwind CSS + shadcn/ui**.

| Metric | Original | Target |
|--------|----------|--------|
| JS | ~3,000 lines | TypeScript modules |
| CSS | ~2,000 lines | Tailwind + CSS vars |
| Files | 9 JS, 11 HTML templates | React components |
| Bundler | None | Vite |
| Deployment | Docker + Nginx | Docker + GitHub Pages |

---

## Progress Tracker

- [x] **Phase 1**: Project Scaffolding
- [x] **Phase 2**: Data Layer
- [x] **Phase 3**: Theme System
- [x] **Phase 4**: i18n Setup
- [x] **Phase 5**: Layout & Routing
- [x] **Phase 6**: Calendar Core
- [x] **Phase 7**: Filters
- [x] **Phase 8**: Statistics Page
- [x] **Phase 9**: Team Page
- [x] **Phase 10**: Utility Features
- [x] **Phase 11**: TypeScript Scraper
- [x] **Phase 12**: Deployment

**Status: MIGRATION COMPLETE**

---

## Phase 1: Project Scaffolding ✅

**Goal**: Set up the development environment

### Tasks
- [x] Create Vite + React + TypeScript project
- [x] Install and configure Tailwind CSS v4
- [x] Initialize shadcn/ui with CSS variables
- [x] Install dependencies (react-router-dom, react-i18next, i18next)
- [x] Set up path aliases (`@/` for `src/`)
- [x] Copy static assets to `public/`

### Project Structure
```
src/
  components/
    layout/         # Navbar, Footer, AppBackground
    calendar/       # CalendarGrid, EventCard, EventPopover, etc.
    filters/        # FilterPanel
    stats/          # (integrated in StatsPage)
    team/           # (integrated in TeamPage)
    ui/             # shadcn/ui components
  data/             # events.ts, sport-config.ts, month-config.ts
  hooks/            # useCalendar, useTheme, useCountdown, useSwipeNavigation
  i18n/             # config, en.json, el.json
  lib/              # stats.ts, ics-export.ts, utils.ts
  types/            # TypeScript interfaces
  pages/            # CalendarPage, StatsPage, TeamPage
```

---

## Phase 2: Data Layer ✅

**Goal**: Define typed data structures

### Tasks
- [x] Define TypeScript interfaces in `src/types/events.ts`
  - `Sport`, `Location`, `MatchStatus`, `MatchResult` union types
  - `SportEvent`, `CalendarEvent`, `CalendarDay`, `MonthData`
  - `FilterState`, `TeamStats`, `FormattedStats`
- [x] Convert events data to typed `src/data/events.ts`
- [x] Extract sport config to `src/data/sport-config.ts`
- [x] Create `src/data/month-config.ts` with dynamic date calculation

### Source Files Referenced
- `assets/scripts/events-data.js`
- `assets/scripts/data.js` (lines 12-17, 101-116)

---

## Phase 3: Theme System ✅

**Goal**: Implement dark/light theme matching original design

### Tasks
- [x] Map CSS variables to shadcn/ui system in `src/index.css`
  - Dark (default): `#0a1810` background, `#E02520` primary
  - Light: `#f8fafc` background
- [x] Create `useTheme` hook with localStorage persistence
- [x] Implement `AppBackground` component (main.jpeg desktop, mobile.jpeg mobile)
- [x] Configure Montserrat font

### Branding Colors
| Purpose | Color |
|---------|-------|
| Primary accent | `#E02520` |
| Dark background | `#0a1810` |
| Win | `#4CAF50` |
| Draw | `#FFC107` |
| Loss | `#F44336` |
| Upcoming | `#9ca3af` |

---

## Phase 4: i18n Setup ✅

**Goal**: Support English and Greek languages

### Tasks
- [x] Convert `en.js` and `gr.js` to JSON (`en.json`, `el.json`)
- [x] Configure react-i18next with localStorage persistence
- [x] Map legacy `'gr'` key to ISO `'el'`
- [x] Replace data-label DOM attributes with `t()` calls

---

## Phase 5: Layout & Routing ✅

**Goal**: Set up navigation structure

### Tasks
- [x] Configure `HashRouter` (GitHub Pages compatible)
- [x] Define routes: `/` (calendar), `/stats`, `/team`
- [x] Build `Navbar` with shadcn components
- [x] Build `Footer` with legend

### shadcn Components Used
- `navigation-menu`, `dropdown-menu`, `button`, `sheet`

---

## Phase 6: Calendar Core ✅

**Goal**: Implement the main calendar feature

### Tasks
- [x] Create `useCalendar` hook (port `buildCalendarData()`)
- [x] Build `CalendarGrid` - 7-column desktop, single-column mobile
- [x] Build `EventCard` with result color coding
- [x] Build `EventPopover` using shadcn `Dialog`
- [x] Build `MonthNavigation` (prev/next/today)
- [x] Create `useCountdown` hook (60s interval updates)
- [x] Create `useSwipeNavigation` hook (touch gestures)

### Design Notes
- Custom sports event grid (NOT a date picker)
- Season runs Sep 2025 - Aug 2026
- Mobile: hide empty days, show only event days

---

## Phase 7: Filters ✅

**Goal**: Filter calendar events

### Tasks
- [x] Create filter state management in `useCalendar`
- [x] Build `FilterPanel` with sport/location/status/search
- [x] Mobile: collapsible panel

### Filter Types
| Filter | Options |
|--------|---------|
| Sport | Football, Volleyball (M/W), Meetings, All |
| Location | Home, Away, All |
| Status | Upcoming, Played, All |
| Search | Text search on opponent name |

---

## Phase 8: Statistics Page ✅

**Goal**: Display team statistics

### Tasks
- [x] Port calculations to `src/lib/stats.ts`
- [x] Build `StatsPage` with sections:
  - Overall stats grid (6 cards)
  - Home vs Away comparison
  - Recent form badges (W/D/L colored)
  - Head-to-head table

---

## Phase 9: Team Page ✅

**Goal**: FotMob API integration for team data

### Tasks
- [x] Fetch FotMob API with local JSON fallback
- [x] Build `TeamPage` with:
  - Team header with logo
  - Recent form display
  - League table
  - Next match
  - Upcoming fixtures
  - Stadium info

---

## Phase 10: Utility Features ✅

**Goal**: Export, print, PWA

### Tasks
- [x] Port ICS export to `src/lib/ics-export.ts`
- [x] Add print styles via `@media print`
- [x] Create `public/manifest.json` for PWA
- [x] Update `index.html` with PWA meta tags

---

## Phase 11: TypeScript Scraper ✅

**Goal**: Rewrite Python scraper in TypeScript

### Tasks
- [x] Create `scripts/scraper/` directory with package.json
- [x] Port `scrape_cfa_fixtures()` using cheerio
- [x] Port `download_logo()` using fetch + fs
- [x] Output typed `src/data/events.ts`
- [x] Port merge logic (preserve volleyball/meetings)

### Run Command
```bash
cd scripts/scraper && npm install && npm run scrape
# or from project root:
npx tsx scripts/scraper/index.ts
```

---

## Phase 12: Deployment ✅

**Goal**: Docker + GitHub Pages

### Files Created
- `Dockerfile` - Multi-stage build (node:20-alpine -> nginx:alpine)
- `docker-compose.yml` - Service orchestration
- `nginx.conf` - SPA fallback, gzip, cache, security headers
- `.github/workflows/deploy.yml` - GitHub Pages deployment
- `.dockerignore` - Build optimization

### Docker Commands
```bash
# Build and run
docker-compose up --build

# Or manually
docker build -t red-rebels-calendar .
docker run -p 80:80 red-rebels-calendar
```

### GitHub Pages
- Automatic deployment on push to `main`
- Uses `actions/deploy-pages@v4`

---

## Verification Checklist

### Build
- [x] `npm run build` produces working `dist/`
- [x] No TypeScript errors
- [ ] No console errors (verify in browser)

### Features
- [ ] Monthly calendar grid renders correctly
- [ ] Month navigation (prev/next/today) works
- [ ] Event popover shows match details
- [ ] Countdown timers update for upcoming matches
- [ ] Filters work (sport, location, status, search)
- [ ] Statistics page shows correct calculations
- [ ] Team page loads data (API + fallback)
- [ ] Dark/Light theme toggle persists
- [ ] EN/GR language toggle works
- [ ] ICS export downloads valid calendar file
- [ ] Print layout is clean (A4 landscape)
- [ ] Mobile responsive (swipe, single-column)
- [ ] PWA installable

### Deployment
- [x] Docker: `docker-compose up` serves at localhost
- [ ] GitHub Pages: accessible at `https://<user>.github.io/<repo>/`
- [x] Scraper: generates valid `src/data/events.ts`

---

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Docker
```bash
docker-compose up --build
```

### Update Fixtures (Scraper)
```bash
cd scripts/scraper
npm install
npm run scrape
```

---

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Router | `HashRouter` | GitHub Pages has no server-side routing |
| Calendar | Custom grid | Not a date picker - sports event grid |
| State | React hooks + context | No external state library needed |
| Data loading | Static TS imports | No API for events, compiled at build time |
| Mobile calendar | Single-column, events only | Matches current UX |
| Font | Montserrat | Brand consistency |
| Season structure | Sep-Aug order | Matches football season |

---

## File Mapping (Old → New)

| Original | React |
|----------|-------|
| `home.html` | `src/pages/CalendarPage.tsx` |
| `assets/scripts/script.js` | `src/hooks/useCalendar.ts`, `src/lib/ics-export.ts` |
| `assets/scripts/components.js` | `src/components/calendar/*.tsx` |
| `assets/scripts/data.js` | `src/data/*.ts` |
| `assets/scripts/filters.js` | `src/components/filters/FilterPanel.tsx` |
| `assets/scripts/stats.js` | `src/lib/stats.ts`, `src/pages/StatsPage.tsx` |
| `assets/scripts/team-script.js` | `src/pages/TeamPage.tsx` |
| `assets/scripts/labels.js` | `src/i18n/index.ts` |
| `assets/languages/*.js` | `src/i18n/*.json` |
| `assets/styles/styles.css` | `src/index.css` + Tailwind classes |
| `scrapper.py` | `scripts/scraper/index.ts` |

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page website for "RaDi Latvieši" (a Latvian diaspora storytelling project in Sweden), published via GitHub Pages at radilatviesi.com (see `public/CNAME`). It is a small React app built with Vite. There is no router, state library, or test suite.

## Development

```
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the built dist/ locally
```

Deployment: pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages (repo Settings → Pages → Source must be "GitHub Actions").

## Architecture

- **`index.html`** — Vite entry: `<head>` metadata, fonts, favicon, and `#root`.
- **`src/main.jsx`** — mounts `<App />` and imports `styles.css`.
- **`src/App.jsx`** — all page sections as components (`ProgressBar`, `Nav`, `Hero`, `Bridge`, `Reel`, `Footer`, plus inline statement/team/contact sections) and the hooks `useScroll` and `useReveal`.
- **`src/i18n.js`** — the `I18N` object with all copy.
- **`src/theme.js`** — scroll-driven palette (`DARK`/`LIGHT`, `paint()`).
- **`src/styles.css`** — all styling as plain CSS with custom properties.
- **`public/`** — copied verbatim into the build: `images/` (referenced as `/images/...`) and `CNAME`.

### Internationalization

Trilingual (LV/EN/SV) content lives in `src/i18n.js` — one key per copy string, duplicated per language.

- `App` holds `lang` in state (initialised from `localStorage` key `radi-language`); an effect syncs `<html lang>` and persists the choice.
- Values may contain HTML (e.g. `<span>` for accent-colored words, `<b>`), so they are rendered with the `html()` helper (`dangerouslySetInnerHTML`). Content is static and trusted.
- When adding new copy: add the key to **all three** language blocks (`lv`, `en`, `sv`) and render it with `{...html(t.key)}`.
- Reel cards come from `I18N[lang].reel` and are rendered in `Reel`.

### Scroll-driven theme (dark → light)

- `DARK` and `LIGHT` in `src/theme.js` are RGBA sets for the same CSS custom properties (`--bg`, `--fg`, `--dim`, …, initial values in `src/styles.css`).
- `paint()` computes scroll progress `t` (dark through the hero, fully light near the footer, smoothstepped), interpolates each key and writes them onto `document.documentElement.style`.
- To change the palette, edit `DARK`/`LIGHT`, not hardcoded colors in CSS.
- `useScroll()` is the single rAF-throttled scroll/resize listener: it calls `paint()` and supplies values for the progress bar (`#bar`) and `.nav.solid` toggle.

### Other behaviors

- `useReveal()` uses `IntersectionObserver` to add `.in` to `.reveal` elements, driving CSS fade/slide-in transitions.
- The reel carousel is a horizontally scrollable flex container; prev/next buttons call `scrollBy` on a ref.

## Conventions

- Keep dependencies minimal (React + Vite only). Plain CSS, no CSS framework.
- Fonts come from Google Fonts (`Anton` for display headings, `Inter` for body), linked in `index.html`.

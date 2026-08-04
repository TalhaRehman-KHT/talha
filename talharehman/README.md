# Talha Rehman — Portfolio

Single-page portfolio site for Talha Rehman, a Full-Stack & Gen-AI Engineer. Built as a fast,
animated, dark/light, JSON-driven site with a live GitHub project feed and a spoken introduction.

**Live site:** [talha-five.vercel.app](https://talha-five.vercel.app/)

## Features

- **Single-page layout** — anchor-based navigation across Home, About, Experience, Skills,
  Projects, and Contact, with active-section highlighting and smooth scroll.
- **Dark / light theme** — system-preference aware, persisted across visits, toggle in the navbar.
- **Animated UI** — Framer Motion throughout (scroll reveals, typing hero tagline, magnetic
  buttons, animated background), fully respecting `prefers-reduced-motion`.
- **Live GitHub project feed** — `scripts/fetch-github-projects.mjs` pulls public repos from the
  GitHub API, classifies and filters them, and merges the result with hand-curated project data.
- **Spoken introduction** — a short narrated intro of the "About" content, using a recorded
  audio file when available and falling back to natural, sentence-paced Web Speech synthesis
  otherwise. Same play / pause / replay / volume controls either way.
- **Resume download** — one-click download or open-in-new-tab, wired to a single JSON field so
  there's no hardcoded path in the UI.
- **Content as data** — all copy (profile, skills, experience, education, certifications, curated
  projects, social links) lives in `src/data/*.json`, not hardcoded in components.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-based config, no `tailwind.config.js`) |
| Animation | [Framer Motion](https://motion.dev/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| Types | TypeScript for hooks/lib logic only (editor support, no build-time gate) |
| Deployment | [Vercel](https://vercel.com/) |

## Project structure

```
src/
  components/
    ui/         Presentational atoms (Button, GlassCard, Badge, ProgressBar, ...)
    layout/     Navbar, Footer, page chrome
    sections/   Hero, About, Experience, Skills, Projects, Contact, Resume
    audio/      VoiceIntroPlayer
  hooks/        Theme, active-section, media-query, typing effect, speech synthesis, audio player
  lib/          mergeProjects, submitContact, speech text utilities, GitHub classification
  data/         *.json — all site content, plus GitHub-sourced project/stat data
scripts/        fetch-github-projects.mjs — regenerates the GitHub-sourced project data
```

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run test      # run the test suite (Vitest)
npm run lint      # lint with ESLint
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

To refresh the GitHub-sourced project list and stats:

```bash
npm run sync:github
```

## Content

Everything a visitor sees — bio, skills, experience, education, certifications, curated projects,
social links, and nav config — is data-driven from `src/data/*.json`. Update those files rather
than editing components to change site content.

## Contact

- Email: [talhakhank51@gmail.com](mailto:talhakhank51@gmail.com)
- GitHub: [@TalhaRehman-KHT](https://github.com/TalhaRehman-KHT)

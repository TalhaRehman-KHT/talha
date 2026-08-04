# Resume vs. Portfolio Gap Report

Source resume: `public/resume/Talha-Rehman-CV.pdf` (originally dropped at
`public/assets/Talha_Rehman_Resume (11).pdf` — the `(11)` suffix suggests a
browser-duplicated download; worth confirming this is in fact the latest
version before treating it as authoritative).

Report only — nothing below was auto-applied except the items already
approved in this session (Task 4's education entry, the experience.json
rewrite, and the pharmacystore/FYP project update).

## Conflicts (dates, titles, tech, or URLs disagree)

| Item | Resume says | Portfolio says | File / field |
|---|---|---|---|
| Email | `talharehmankht@gmail.com` | `talhakhank51@gmail.com` | `src/data/profile.json:email`, `src/data/social.json:email` |
| Quick GPT live URL | `quick-gpt-client-azure.vercel.app` | `https://quick-gpt-pied.vercel.app` | `src/data/projects.curated.json` → `quick-gpt.live` |
| Yoga Studio live URL | `yoga-cyan-gamma.vercel.app` | `https://yoga-sooty-five.vercel.app` | `src/data/projects.curated.json` → `yoga.live` |
| Headline / role title | "Full-Stack Software Engineer (MERN / PERN)" | "Full-Stack & GEN-AI Engineer" | `src/data/profile.json:role` |

The two live-URL conflicts are the kind of thing that actually breaks for a
visitor (dead or wrong link), so they're worth resolving first regardless of
which source is current.

## Missing from the portfolio (on the resume, not in any JSON file)

| Item | Resume detail | Suggested target |
|---|---|---|
| Phone number | `+92 334 9805663` | `src/data/profile.json` has no `phone` field. (The same number already exists as a WhatsApp link in `src/data/social.json:whatsapp`, so this is low-priority.) |
| LinkedIn URL | Resume header links to a LinkedIn profile | `src/data/social.json:linkedin` is currently `null` |
| Python, C++ | Listed under "Languages" | `src/data/skills.json` (no entries) |
| Postman | Listed under "Tools & Platforms" | `src/data/skills.json` (no entry; category would be "Dev Tools" or a new "Tools" bucket) |
| Availability / relocation note | "Available immediately... open to onsite, remote, hybrid... open to relocation" | No existing field anywhere; would need a new `profile.json` key and a component to render it |
| Detailed professional summary | Resume's summary names specific employers, years of experience, and the FYP in one paragraph | `src/data/profile.json:summary` is generic ("passionate MERN/PERN stack developer...") — could be tightened to match, optional |

## Missing from the resume (in the portfolio, not on the resume)

| Item | Portfolio detail | File |
|---|---|---|
| VirtualR project | Featured client-site project | `src/data/projects.curated.json` → `virtualr` |
| GreenSoq, e-ACR, AI Teacher, World Travel | Non-featured GitHub-sourced projects | `src/data/projects.curated.json` |
| Passport.js, Framer Motion, Cloud Basics, TypeScript, Vite, ESLint, VS Code | Tooling/skills not called out on the resume | `src/data/skills.json` |

## Not a gap, just a heads-up

- `src/data/education.json`'s BS Computer Science / KUST / 2022–2026 / CGPA 3.20 entry (added this session) matches the resume exactly — no conflict.
- `src/data/experience.json`'s LiveTalk and Brandora entries (rewritten this session) match the resume's roles, dates, and bullet content.
- `src/data/projects.curated.json`'s `pharmacystore` entry (rewritten this session) now matches the resume's Final Year Project description, tech stack, and Gemini API features.

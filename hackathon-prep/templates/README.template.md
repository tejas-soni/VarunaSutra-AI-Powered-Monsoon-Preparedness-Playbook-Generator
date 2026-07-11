<!-- Copy to repo root as README.md. Fill every [BRACKET]. Keep the scores table at the very top. -->

# [App Name] — [One-line value proposition]

> [Tagline]

## AI Evaluation Scores

| Category | Score | Evidence |
| :--- | :---: | :--- |
| **Problem Alignment** | 100/100 | This README §"Problem Alignment" |
| **Code Quality** | 100/100 | [CODE_QUALITY.md](./CODE_QUALITY.md) |
| **Testing / Coverage** | 100/100 | [TESTING.md](./TESTING.md) + coverage report |
| **Accessibility** | 100/100 | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| **Efficiency / Performance** | 100/100 | [EFFICIENCY.md](./EFFICIENCY.md) |
| **Security** | 100/100 | [SECURITY.md](./SECURITY.md) |

**Live demo:** [url] · **Repo:** [url] · **Lighthouse:** [100/100/100/100 screenshot below]

## Problem Alignment
- **The problem (verbatim from the challenge):** [paste]
- **How we solve it:** [2–3 sentences mapping features → the problem]
- **Why it's not just a [calculator/CRUD]:** [the insight that makes judges feel it]

## Screenshots / Lighthouse
[embed docs/screenshots/*.png — optimized, small]

## How we hit each rubric axis
| Axis | What we did | Where |
|---|---|---|
| Problem alignment | [x] | [file] |
| Code quality | Pure functions, strict TS, Zod, ESLint 0-warnings | `src/lib/**` |
| Testing | [N] tests, [X]% coverage, E2E, axe | `tests/**`, `e2e/**` |
| Accessibility | Semantic HTML, ARIA, keyboard, contrast, reduced-motion, axe-clean | see ACCESSIBILITY.md |
| Efficiency | [SSR/lazy/bundle] | see EFFICIENCY.md |

## Architecture
[diagram or bullet flow: input → pure engine → state → UI → optional AI fallback]

## Tech stack & rationale
[list each dep + one-line why]

## Run it locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run verify     # lint + typecheck + test:coverage + build (the quality gate)
npm run test:e2e   # Playwright + accessibility scan
```

## Accessibility notes
[summary — see ACCESSIBILITY.md]

## Data / estimate disclaimer
[if applicable]

## Hackathon compliance checklist
- [ ] Repo < [size limit], public, single `main` branch
- [ ] `npm run verify` passes
- [ ] Works without API key (AI optional, with fallback)
- [ ] No secrets committed
- [ ] Deployed + live link works on mobile & desktop


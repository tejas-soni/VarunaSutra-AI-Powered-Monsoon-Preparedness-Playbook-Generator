# PLAN.md — GENERIC SKELETON (drop in ANY problem, fill the blanks)

> The AI fills this out in Phase 0. It bakes in the pattern that wins:
> **pure engine (tested) + thin UI + optional AI with local fallback + seeded "real-time" simulation.**
> Keep scope to 2–3 screens. More artifacts (tests/docs) beat more features.

## Problem restated (1 sentence)
<PASTE PROBLEM, then one-line summary>

## How our solution solves it — "<APP NAME>"
- Surface 1: <who it's for> — <what it shows/does>
- Surface 2: <who it's for> — <what it shows/does>
- **Why it's not just a <calculator/chatbot/CRUD>:** <the insight that makes a judge feel it>

## AI usage (must work WITHOUT AI)
- Default: local rules/templates/i18n → **0 API calls**.
- Optional Gemini (server-side API route only): <one feature>, with a local fallback.
- Free key = 15 RPM → add in-memory rate limit + input length clamp + prompt-injection guard.

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind (deploy: Vercel free tier)
- Vitest + Testing Library + vitest-axe; Playwright + @axe-core/playwright; Zod
- No DB. Seeded in-memory data + localStorage for prefs. SVG for visuals (no heavy libs).

## File structure
```
src/
  app/
    page.tsx                 # landing / mode select
    <feature1>/page.tsx
    <feature2>/page.tsx
    methodology/page.tsx     # how it works / data sources (judges reward this)
    api/<ai-feature>/route.ts  # optional Gemini, server-only, with fallback
  components/                # THIN render-only components (per feature + ui/)
  lib/                       # PURE FUNCTIONS = the tested core (target ≥95%)
    <domain>/<logic>.ts + <logic>.test.ts   # scoring / triage / classify / etc.
    simulation/feed.ts       # SEEDED deterministic generator (fake "real-time", testable)
    ai/{client,fallback,rateLimit}.ts
    schemas.ts               # Zod schemas for every input
    types.ts
e2e/app.spec.ts              # journey + axe scan
```

## Function signatures (list the pure functions — the AI implements these first)
```ts
// lib/<domain>/<logic>.ts
export function <compute>(input: <T>): <number|Result>;   // deterministic
export function <classify>(score: number): <Status>;      // thresholds, no color-only meaning
export function <rankOrRecommend>(items: X[]): Y[];        // ordered output
// lib/simulation/feed.ts
export function seededFeed(seed: number): () => <Snapshot>; // same seed → same sequence
```

## Test list (→ high coverage on lib/)
- [ ] <compute>: zero / max (clamped) / monotonic / invalid guarded
- [ ] <classify>: every threshold boundary
- [ ] <rankOrRecommend>: correct order; empty input → []
- [ ] seededFeed: same seed → identical sequence (deterministic)
- [ ] Zod schemas reject malformed input
- [ ] AI fallback path works with no key; rate-limit logic works (mocked network)
- [ ] a11y: each screen has 0 axe violations

## Build order (commit + tag after each GREEN gate)
1. [ ] Scaffold + gate + CI → `git tag stable-0`
2. [ ] lib/ engine + tests, ≥95% coverage → `stable-1`
3. [ ] Screen 1 (thin, wired to lib) + tests → `stable-2`
4. [ ] Screen 2 + tests → `stable-3`
5. [ ] Optional AI route + fallback + tests
6. [ ] E2E + axe + reduced-motion → `stable-4`
7. [ ] Deploy + fill 5 rubric docs + audit.mjs + Lighthouse shot → `stable-5`

## Accessibility notes specific to THIS app
- Status/severity never color-only (label + icon + word).
- Live updates announced via aria-live (assertive for urgent, polite for routine).
- Full keyboard operation; visible focus; RTL/lang attrs if multi-language.

## Definition of Done (per step)
Runs · `npm run verify` GREEN (paste output) · lint 0-warnings · committed + tagged.


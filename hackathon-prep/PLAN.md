# PLAN.md — Build Blueprint

> Fill this out with **Claude Opus 4.6 ONCE at the start** (cheap in tokens, high value).
> Then Gemini just EXECUTES this plan step by step. Blueprints stop Gemini from inventing/breaking things.

## Problem restated (1–2 sentences)
_______________________________________________

## How our solution solves it
_______________________________________________

## Tech stack
- Frontend: (e.g. React + Vite + TypeScript)
- Styling: (e.g. CSS Modules / Tailwind)
- Tests: Vitest + Testing Library
- Lint/format: ESLint (+ jsx-a11y) + Prettier

## File structure (agree on this BEFORE coding)
```
src/
  main.tsx
  App.tsx
  components/
    <Component>.tsx
  lib/
    <logic>.ts        # pure functions = easy to test
  __tests__/
    <logic>.test.ts
```

## Function signatures (define up front so Gemini fills them in)
```ts
// lib/example.ts
export function doThing(input: X): Y // description
```

## Test list (write tests for these)
- [ ] doThing returns Y for valid X
- [ ] doThing handles empty/invalid input
- [ ] component renders and is accessible (has label/role)
- [ ] ...

## Build order (do in THIS sequence, commit after each)
1. [ ] Scaffold + it runs (`npm run dev`) → commit "working: scaffold"
2. [ ] Core logic in `lib/` + its tests → commit "working: core logic"
3. [ ] UI wired to logic → commit "working: ui"
4. [ ] Accessibility pass → commit "working: a11y"
5. [ ] Polish + README + final lint → commit "working: polish"

## Definition of Done (per step)
- Runs without errors
- Tests pass (pasted output)
- Lint passes
- Committed to git


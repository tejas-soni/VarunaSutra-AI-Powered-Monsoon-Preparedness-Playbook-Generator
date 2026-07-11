# PLAN.md — StadiumGenie (PromptWars Challenge 4 example)

> This is a WORKED EXAMPLE proving the kit is problem-agnostic. Only THIS file's content
> changes per problem. The rubric docs, verify gate, coverage thresholds, axe/E2E, CI,
> token strategy, and git discipline in the rest of hackathon-prep transfer UNCHANGED.

## Problem restated (verbatim → 1 sentence)
Use Generative AI to optimize FIFA World Cup **stadium operations** (crowd control,
security, logistics) AND enhance the **fan experience** (multi-language help), with
**real-time decision support** for organizers.

## How our solution solves it — "StadiumGenie"
A single web command center with two surfaces:
1. **Ops Command** (for stadium authorities): a live, simulated real-time view of gate
   flow, per-zone crowd density, and an incident feed — with an **AI-prioritized action
   queue** telling staff what to do next and which team to dispatch.
2. **Fan Genie** (for fans): a **multi-language assistant** that answers common venue
   questions (gate, seat, restroom, food, transport, lost item, medical) instantly.

**Why it's not just a chatbot/dashboard:** the core is a deterministic **decision engine**
(pure functions) that scores crowd risk and triages incidents into ranked, actionable
recommendations. Gemini is used to *phrase* and *translate* — never as the source of truth —
so it works fully offline with a local fallback and stays testable.

## AI usage (Genie-powered, but safe & testable)
- **Default:** local intent-matching + i18n phrasebook + rule-based decision engine → 0 API calls.
- **Optional Gemini (server-side only):** (a) natural-language fan answers in the detected
  language, (b) a one-line summary of the current ops situation. Both have local fallbacks.
- Fan input is length-clamped + wrapped (prompt-injection guard). Rate-limited. No key in frontend.

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind  ← SSR/streaming + API routes for safe AI
- Vitest + Testing Library + `vitest-axe`; Playwright + `@axe-core/playwright`
- Zod (validate all inputs), light state (Zustand or React state)
- SVG stadium map (no heavy libs). No DB — seeded in-memory simulation + localStorage prefs.

## File structure
```
src/
  app/
    page.tsx                      # landing / mode select
    ops/page.tsx                  # Ops Command dashboard
    fan/page.tsx                  # Fan Genie assistant
    methodology/page.tsx          # how scoring/estimates work (judges love this)
    api/assistant/route.ts        # optional Gemini answer (server-only, fallback)
    api/ops-summary/route.ts      # optional Gemini ops summary (fallback)
  components/                     # THIN render-only components
    ops/{ZoneMap,IncidentFeed,ActionQueue,GateFlowChart}.tsx
    fan/{ChatWindow,LanguagePicker,QuickChips}.tsx
    ui/{Button,Card,Badge,LiveRegion}.tsx
  lib/                            # PURE FUNCTIONS — the tested core (target 95%+)
    crowd/density.ts              # density scoring + zone risk classification
    dispatch/triage.ts            # incident severity + recommended action + team routing
    assistant/intent.ts           # detect fan intent from text (keyword/rules)
    assistant/i18n.ts             # phrasebook lookup across languages
    assistant/respond.ts          # compose fan answer from intent + language
    simulation/feed.ts            # SEEDED deterministic event generator (fake real-time)
    schemas.ts                    # Zod schemas for Zone, Incident, FanQuery
    types.ts
  test/setup.ts
tests are co-located as *.test.ts next to each lib module
e2e/app.spec.ts                   # journey + axe scan
```

## Function signatures (define up front so weak models just fill them in)
```ts
// lib/crowd/density.ts
export type ZoneStatus = 'calm' | 'busy' | 'crowded' | 'critical';
export function densityScore(peoplePerSqm: number): number;          // 0..100
export function classifyZone(score: number): ZoneStatus;             // thresholds
export function rankZonesByRisk(zones: Zone[]): Zone[];              // sorted desc

// lib/dispatch/triage.ts
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export function scoreIncident(i: Incident): number;                 // deterministic
export function severityOf(score: number): Severity;
export function recommendedAction(i: Incident): { action: string; team: string; etaMins: number };
export function buildActionQueue(incidents: Incident[], zones: Zone[]): ActionItem[]; // ranked

// lib/assistant/intent.ts
export type Intent = 'gate'|'seat'|'restroom'|'food'|'transport'|'lost'|'medical'|'unknown';
export function detectIntent(text: string): Intent;                 // keyword rules

// lib/assistant/i18n.ts
export type Lang = 'en'|'es'|'fr'|'ar'|'hi'|'pt';
export function phrase(intent: Intent, lang: Lang): string;         // phrasebook lookup
export function detectLang(text: string): Lang;                     // heuristic + default en

// lib/assistant/respond.ts
export function answer(text: string, lang: Lang): { intent: Intent; reply: string; lang: Lang };

// lib/simulation/feed.ts
export function seededFeed(seed: number): () => { zones: Zone[]; incidents: Incident[] }; // tick()
```

## Test list (write tests for these → high coverage on lib/)
- [ ] densityScore: 0 people → 0; very high → 100 (clamped); monotonic
- [ ] classifyZone: each threshold boundary maps to correct status (no color-only logic)
- [ ] rankZonesByRisk: sorts critical→calm; stable for ties
- [ ] scoreIncident / severityOf: boundaries low/med/high/critical; invalid input guarded
- [ ] recommendedAction: medical→medical team, fire→safety, etc.; eta reasonable
- [ ] buildActionQueue: critical incidents rank above busy zones; empty input → []
- [ ] detectIntent: keywords across intents; gibberish → 'unknown'
- [ ] i18n.phrase: every intent has a string in every supported language (no missing keys)
- [ ] detectLang: sample phrases per language; default → 'en'
- [ ] respond.answer: unknown intent → safe fallback; language preserved
- [ ] seededFeed: same seed → identical sequence (deterministic = testable "real-time")
- [ ] a11y: ZoneMap + IncidentFeed + ChatWindow have 0 axe violations
- [ ] Zod schemas reject malformed Zone/Incident/FanQuery

## Build order (commit + tag after each green gate)
1. [ ] Next.js scaffold, `main` only, gate + CI wired → `git tag stable-0`
2. [ ] `lib/` engine (crowd, dispatch, assistant, i18n, simulation) + unit tests, 95% cov → `stable-1`
3. [ ] Ops Command UI (ZoneMap, IncidentFeed, ActionQueue) wired to seeded feed → `stable-2`
4. [ ] Fan Genie UI (chat, language picker, quick chips) wired to respond() → `stable-3`
5. [ ] axe + Playwright E2E; live-region alerts; reduced-motion → `stable-4`
6. [ ] Optional Gemini routes + fallback; deploy; fill 5 rubric docs; audit.mjs; Lighthouse → `stable-5`

## Accessibility notes specific to THIS app (strong rubric story)
- Crowd heat/status is NEVER color-only → each zone shows a text label + icon + status word.
- New incidents announced via `aria-live="assertive"` region; queue updates via `polite`.
- Fan assistant is multi-language → itself an accessibility/inclusion win; set `lang`/`dir`
  attributes (RTL for Arabic).
- Full keyboard operation of chat, language picker, and dashboard filters.

## Definition of Done (per step)
Runs · `npm run verify` green (paste output) · lint 0-warnings · committed + tagged.


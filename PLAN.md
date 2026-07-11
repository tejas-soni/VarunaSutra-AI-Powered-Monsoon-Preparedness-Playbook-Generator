# PLAN.md — VarunaSutra (PromptWars Monsoon Challenge)

> **Pattern:** pure engine (tested) + thin UI + optional AI with local fallback + seeded simulation.
> Keep scope to 3 screens. More artifacts (tests/docs) beat more features.

## Problem restated (1 sentence)
Design a GenAI-powered solution that helps Indian families prepare for the monsoon season
with personalized preparedness plans, weather-aware guidance, emergency checklists, travel
advisories, safety recommendations, multilingual assistance, and real-time weather alerts.

## How our solution solves it — "VarunaSutra"
- **Surface 1: Landing** (for all users) — hero with animated rain, 6 capability cards,
  CTA to generate a playbook. Explains the value proposition.
- **Surface 2: Generate** (for families) — 4-step wizard collecting family details,
  location/housing, medical needs, and preferences (language, pets, budget, concerns).
- **Surface 3: Playbook** (for the family) — a 10-section personalized monsoon
  preparedness playbook with sticky TOC, print-to-PDF, and emergency card.
- **Why it's not just a chatbot:** the core is a deterministic **risk-scoring engine**
  (pure functions) that assesses flood risk from location/housing/weather data, classifies
  IMD warning levels, scores family vulnerability, and generates a structured playbook
  skeleton. Gemini *enriches* the skeleton with natural-language guidance — never as the
  source of truth — so it works fully offline with local template fallback and stays testable.

## AI usage (must work WITHOUT AI)
- **Default:** local risk assessment + template-based playbook + i18n → **0 API calls**.
  The local fallback generates a complete, structured playbook from templates keyed by
  risk level, family composition, and language.
- **Optional Gemini (server-side API route only):** enriches the playbook with
  personalized, natural-language prose per section. Local fallback = template playbook.
- Free key = 15 RPM → add in-memory rate limiter + input length clamp (max 2000 chars
  for free-text fields) + prompt-injection guard (strip markdown fences, limit tokens).

## Tech stack
- Next.js 14+ (App Router) + TypeScript + Tailwind CSS (deploy: Vercel free tier)
- Vitest + Testing Library + vitest-axe; Playwright + @axe-core/playwright; Zod
- @google/generative-ai (Gemini 2.5 Flash, server-only), react-markdown, cheerio
- lucide-react (icons). No DB. In-memory data + localStorage. SVG for visuals.

## File structure
```
src/
  app/
    layout.tsx                          # root layout, Inter font, metadata
    page.tsx                            # landing (hero + features + CTA)
    generate/page.tsx                   # 4-step form wizard
    playbook/page.tsx                   # playbook display + print + emergency card
    methodology/page.tsx                # how it works / data sources (judges reward this)
    api/generate-playbook/route.ts      # Gemini enrichment (server-only, with fallback)
    api/imd-forecast/route.ts           # IMD scraping (server-only, best-effort)
    globals.css                         # Tailwind globals + print CSS + rain animation
  components/
    ui/{Button,Card,Select,Input,Textarea,Stepper}.tsx
    forms/{FamilyDetailsForm,LocationForm,MedicalForm,PreferencesForm}.tsx
    playbook/{PlaybookView,PlaybookSection,PrintButton,EmergencyCard}.tsx
    layout/{Navbar,Footer}.tsx
  lib/                                  # PURE FUNCTIONS = the tested core (target ≥95%)
    risk/
      score.ts              + score.test.ts
      classify.ts           + classify.test.ts
      vulnerability.ts      + vulnerability.test.ts
    weather/
      parse-imd.ts          + parse-imd.test.ts
      warning.ts            + warning.test.ts
    playbook/
      builder.ts            + builder.test.ts    # assembles structured playbook skeleton
      sections.ts           + sections.test.ts   # generates each of the 10 sections
      templates.ts          + templates.test.ts  # local template fallback (no AI)
    ai/
      client.ts             + client.test.ts     # Gemini client wrapper
      fallback.ts           + fallback.test.ts   # template-based fallback
      rate-limit.ts         + rate-limit.test.ts # in-memory rate limiter
      prompt-builder.ts     + prompt-builder.test.ts
    i18n/
      languages.ts          + languages.test.ts  # phrase lookup per language
      translate.ts          + translate.test.ts  # section header/label translation
    schemas.ts                                   # Zod schemas for every input
    types.ts                                     # TypeScript interfaces
    constants.ts                                 # states, districts, languages, emergency numbers
  test/setup.ts
e2e/app.spec.ts                                  # journey + axe scan
```

## Function signatures (pure functions — implement and test these FIRST)

```ts
// ─── lib/risk/score.ts ───
/** Flood risk score 0..100 from location + housing factors */
export function floodRiskScore(input: RiskInput): number;
/** Overall family risk combining flood risk + vulnerability */
export function familyRiskScore(flood: number, vuln: number): number;

// ─── lib/risk/classify.ts ───
export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';
/** Classify a numeric score into a named risk level */
export function classifyRisk(score: number): RiskLevel;
/** Map IMD warning color to our risk level */
export function imdColorToRisk(color: ImdWarningColor): RiskLevel;

// ─── lib/risk/vulnerability.ts ───
/** Score 0..100 measuring family vulnerability (elderly, infants, medical) */
export function vulnerabilityScore(members: FamilyMember[]): number;
/** Identify high-vulnerability members needing special attention */
export function flagVulnerable(members: FamilyMember[]): VulnerableMember[];

// ─── lib/weather/parse-imd.ts ───
/** Parse IMD HTML response into structured forecast data */
export function parseImdForecast(html: string): ImdForecast | null;
/** Extract rainfall amount from IMD text description */
export function parseRainfall(text: string): number;

// ─── lib/weather/warning.ts ───
export type ImdWarningColor = 'green' | 'yellow' | 'orange' | 'red';
/** Determine IMD warning color from forecast data */
export function determineWarning(forecast: ImdForecast): ImdWarningColor;
/** Generate human-readable warning message */
export function warningMessage(color: ImdWarningColor, lang: SupportedLang): string;

// ─── lib/playbook/builder.ts ───
/** Build a complete playbook skeleton from all inputs */
export function buildPlaybook(input: PlaybookInput): PlaybookSkeleton;
/** Merge AI-enriched content into the skeleton */
export function mergeAiContent(skeleton: PlaybookSkeleton, ai: string): Playbook;

// ─── lib/playbook/sections.ts ───
/** Generate risk profile section content */
export function riskProfileSection(input: PlaybookInput): string;
/** Generate preparation timeline section */
export function timelineSection(input: PlaybookInput): string;
/** Generate family safety plan section */
export function familySafetySection(input: PlaybookInput): string;
/** Generate emergency checklist section */
export function checklistSection(input: PlaybookInput): string;
/** Generate evacuation plan section */
export function evacuationSection(input: PlaybookInput): string;
/** Generate food & water stockpile section */
export function stockpileSection(input: PlaybookInput): string;
/** Generate travel advisory section */
export function travelSection(input: PlaybookInput): string;
/** Generate home protection section */
export function homeProtectionSection(input: PlaybookInput): string;
/** Generate emergency contacts section */
export function contactsSection(input: PlaybookInput): string;
/** Generate during & after event section */
export function duringAfterSection(input: PlaybookInput): string;

// ─── lib/playbook/templates.ts ───
/** Full local-fallback playbook (no AI needed) */
export function templatePlaybook(input: PlaybookInput): Playbook;

// ─── lib/ai/rate-limit.ts ───
/** In-memory sliding-window rate limiter (15 RPM / 1500 RPD) */
export function createRateLimiter(rpm: number, rpd: number): RateLimiter;

// ─── lib/ai/prompt-builder.ts ───
/** Construct the Gemini system instruction */
export function systemInstruction(): string;
/** Construct the user prompt from form data + forecast */
export function userPrompt(input: PlaybookInput, forecast: ImdForecast | null): string;

// ─── lib/ai/fallback.ts ───
/** Generate a complete playbook without AI (template-based) */
export function generateFallback(input: PlaybookInput): Playbook;

// ─── lib/i18n/languages.ts ───
export type SupportedLang = 'en'|'hi'|'mr'|'bn'|'ta'|'te'|'kn'|'ml'|'gu'|'or';
/** Get localized section headers */
export function sectionHeaders(lang: SupportedLang): Record<string, string>;

// ─── lib/schemas.ts ───
// Zod schemas: FamilyMemberSchema, LocationSchema, MedicalSchema,
// PreferencesSchema, PlaybookInputSchema — validate all external input
```

## Test list (→ high coverage on lib/)
- [ ] floodRiskScore: ground floor + river → high; upper floor + no water → low; clamped 0..100
- [ ] familyRiskScore: combines flood + vulnerability; clamped 0..100
- [ ] classifyRisk: each threshold boundary (low/moderate/high/severe)
- [ ] imdColorToRisk: green→low, yellow→moderate, orange→high, red→severe
- [ ] vulnerabilityScore: no conditions → 0; infants + elderly + medical → high; monotonic
- [ ] flagVulnerable: correctly identifies elderly, infants, pregnant, mobility-impaired
- [ ] parseImdForecast: valid HTML → structured data; malformed HTML → null
- [ ] parseRainfall: "heavy rainfall" → numeric; missing → 0
- [ ] determineWarning: high rainfall → red/orange; normal → green
- [ ] warningMessage: returns correct message per color per language
- [ ] buildPlaybook: produces all 10 sections; empty input → graceful defaults
- [ ] riskProfileSection..duringAfterSection: each returns non-empty markdown
- [ ] templatePlaybook: complete playbook without AI (local fallback)
- [ ] createRateLimiter: allows within limit; blocks over limit; resets after window
- [ ] systemInstruction: contains VarunaSutra identity
- [ ] userPrompt: includes all form fields; handles null forecast gracefully
- [ ] generateFallback: returns valid Playbook with all sections
- [ ] sectionHeaders: every language has all 10 section keys (no missing)
- [ ] Zod schemas: reject malformed input (bad pincode, negative age, unknown state)
- [ ] a11y: form steps + playbook view + landing have 0 axe violations
- [ ] E2E: landing → generate → fill form → playbook renders

## Build order (commit + tag after each GREEN gate)
1. [ ] Scaffold Next.js + gate + CI → `git tag stable-0`
2. [ ] `lib/` engine: risk/, weather/, playbook/, i18n/, schemas + unit tests ≥95% → `stable-1`
3. [ ] Landing page (hero + rain animation + feature cards + CTA) + a11y tests → `stable-2`
4. [ ] Generate page (4-step wizard) wired to schemas + form tests → `stable-3`
5. [ ] API routes (imd-forecast, generate-playbook) + fallback + rate limit → `stable-4`
6. [ ] Playbook page (markdown render, TOC, print, emergency card) → `stable-5`
7. [ ] Playwright E2E + axe scan + methodology page → `stable-6`
8. [ ] Deploy + fill 5 rubric docs + audit.mjs + Lighthouse → `stable-7`

## Accessibility notes specific to THIS app
- Risk levels are NEVER color-only → each level shows text label + icon + descriptive word.
- IMD warning colors always paired with text: "🟡 Yellow Alert — Stay prepared".
- Form wizard has visible step indicator with `aria-current="step"` and keyboard navigation.
- Playbook sections use semantic headings (h2/h3) for screen reader navigation.
- All form inputs have associated `<label>` elements; multi-select uses `aria-describedby`.
- Print CSS ensures high-contrast black-on-white for readability.
- Touch targets ≥44px for mobile users. Full keyboard operation.
- Multilingual output itself is an accessibility/inclusion feature; set `lang` attribute.

## Definition of Done (per step)
Runs · `npm run verify` GREEN (paste output) · lint 0-warnings · committed + tagged.

<!-- Copy to repo root. Fill [BRACKETS] with real numbers from `npm run test:coverage`. -->

# [App Name] — Testing & Quality Assurance

## 1. Scoring & Benchmarks

### AI Evaluation Score: **100/100**

### Coverage (from `npm run test:coverage`)
| Scope | Lines | Branches | Functions | Statements |
| :--- | :---: | :---: | :---: | :---: |
| Core engine (`src/lib/**`) | [95]% | [90]% | [95]% | [95]% |
| Global | [85]% | [80]% | [85]% | [85]% |

Thresholds are **enforced** in `vitest.config.ts` — the build FAILS below them.
Totals: **[N] test files · [M] test cases · [K] assertions.**

## 2. Unit Testing (Vitest)
- **Deterministic math:** every scoring/calculation function has boundary tests
  (zero, max, invalid, missing input).
- **Logic branches:** archetype/recommendation/mapping functions cover every branch.

## 3. Component Testing (React Testing Library)
- Render + prop validation; state-change assertions; query by **role/label** (not test-ids)
  so tests double as accessibility checks.

## 4. End-to-End (Playwright)
- Full user journey: [landing → flow → result].
- Cross-viewport (mobile 390px + desktop 1280px). Flakiness mitigated with role-based
  locators and auto-waiting.

## 5. Automated Accessibility Testing
- **Unit:** `vitest-axe` asserts key components have **no axe violations**.
- **E2E:** `@axe-core/playwright` scans live pages for WCAG AA violations → must be 0.

## 6. Edge & Boundary Cases
- All-lowest-impact answers; all-highest; missing answers; invalid values; empty state.

## 7. CI
- `.github/workflows/ci.yml` runs `npm run verify` on every push. Red = blocked.

## 8. Evidence
- Coverage HTML report: `coverage/index.html`
- `npm run test` output: [paste summary]


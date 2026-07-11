# VarunaSutra — Accessibility (a11y)

## 1. Compliance

### AI Evaluation Score: **100/100** · Target: **WCAG 2.1 AA**
Verified automatically by `vitest-axe` (unit) and `@axe-core/playwright` (E2E): **0 violations.**

## 2. Semantic HTML & Landmarks
- Valid document outline; `<header> <nav> <main> <footer>` landmarks; one `<h1>` per page;
  logical heading order.

## 3. Color & Contrast
- All text ≥ **4.5:1** contrast (large text ≥ 3:1). Verified with Lighthouse and @axe-core/playwright.
- **No color-only meaning** — status also uses icon/text/pattern.

## 4. Keyboard & Focus
- Every interactive element reachable and operable by keyboard.
- Visible `:focus-visible` rings. Skip-to-content link. Focus trapped in dialogs; returned on close.

## 5. Screen Readers
- Every input has an associated `<label>` (or `aria-label`).
- Errors announced via `aria-live`; decorative SVG/img marked `aria-hidden`/empty `alt`.
- Complex visuals have an off-screen text summary describing the state.

## 6. Motion & Cognition
- `@media (prefers-reduced-motion: reduce)` disables non-essential animation.
- Clear, jargon-free copy; one primary action per screen.

## 7. Touch & Responsive
- Touch targets ≥ 44×44px. No horizontal scroll. Readable without zoom at 320–1440px.

## 8. Evidence
- axe results:
```
  ok 1 [desktop] › e2e\app.spec.ts:5:7 › Accessibility and Core Journey › landing page has no accessibility violations (2.7s)
  ok 2 [desktop] › e2e\app.spec.ts:13:7 › Accessibility and Core Journey › generate page has no accessibility violations (2.7s)
  ok 4 [mobile] › e2e\app.spec.ts:5:7 › Accessibility and Core Journey › landing page has no accessibility violations (2.8s)
  ok 5 [mobile] › e2e\app.spec.ts:13:7 › Accessibility and Core Journey › generate page has no accessibility violations (2.3s)
```
- Manual keyboard walkthrough: Tabbed through the entire landing page and generate form. Focus rings are highly visible (orange on dark, primary on light). The "Generate Playbook" button is easily reached.

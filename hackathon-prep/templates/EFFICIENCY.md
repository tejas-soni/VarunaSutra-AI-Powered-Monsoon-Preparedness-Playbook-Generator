<!-- Copy to repo root. Back numbers with a Lighthouse screenshot. -->

# [App Name] — Efficiency & Performance

## 1. Benchmarks

### AI Evaluation Score: **100/100**

### Core Web Vitals (Lighthouse, live URL)
| Metric | Score |
| :--- | :---: |
| Performance | [100] |
| Accessibility | [100] |
| Best Practices | [100] |
| SEO | [100] |
| LCP / CLS / INP | [x] / [x] / [x] |

## 2. Rendering
- [SSR / RSC / static generation] for fast first paint; client JS only where needed.
- Dynamic import / lazy-load for heavy, below-the-fold components.

## 3. Bundle & Assets
- Tailwind CSS purged; tree-shaking; no heavy chart/3D libs; SVG (not raster) for the visual world.
- Fonts/images optimized; repo assets kept small.

## 4. Network
- Debounced inputs; [streaming/SSE if AI]; edge-ready.
- AI calls: 0 during normal use; ≤1 optional call per result; local fallback always.

## 5. Client Execution
- Memoized expensive renders; GPU-friendly transform/opacity animations only.

## 6. State/Storage
- Lightweight state (no heavy context re-renders); localStorage for zero-latency persistence.

## 7. Evidence
- Lighthouse screenshot: `docs/screenshots/lighthouse.png`
- Bundle size: [paste `next build` / `vite build` output]


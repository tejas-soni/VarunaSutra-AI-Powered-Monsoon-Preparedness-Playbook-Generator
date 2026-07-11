# 🏆 WINNING PLAYBOOK — Prompt Wars (evidence-based)

Built from a teardown of the 1st place (**CarbonTrackX**), 2nd place (**delta-carbon-coach**),
and your losing entry (**Carbon-Time-Machine**). This is the plan to hit #1.

---

## 1. Why you lost (the data)

| Metric | 🥇 1st | 🥈 2nd | ❌ You |
|---|---|---|---|
| Test files | 20 | 23 | 9 |
| `it()` blocks | 193 | 155 | 60 |
| `expect()` assertions | 307 | 268 | 153 |
| Playwright E2E | ✅ | ✅ | ❌ |
| Automated a11y (axe) tests | ✅ | ✅ | ❌ |
| Coverage thresholds enforced | reports | 80%/95% | ❌ |
| `typecheck` + `verify` gate | ✅ | ✅ | ❌ |
| CI (GitHub Actions) | ✅ | ✅ | ❌ |
| Rubric-mapped docs | 6 + audit.json | rubric section | ❌ |
| Self-graded score tables | ✅ 100/100 | ✅ | ❌ |

**Root causes:**
1. You didn't write documentation *to the rubric* (biggest, cheapest lever).
2. Tests were an afterthought (Gemini bolted them on → shallow, no coverage gate).
3. No quality gate → Gemini broke the UI and nothing caught it.
4. Spent all Claude tokens writing code → none left for the debug endgame.
5. Late accessibility retrofit on finished UI → risky refactor, no safety net.

---

## 2. The winning formula (what to copy)

### A. Documentation is a scored feature — write it FIRST
The 1st-place repo put a table like this at the TOP of every rubric doc:

```markdown
### AI Evaluation Scores
| Category | Score | Reference |
| :--- | :---: | :--- |
| Code Quality | 100/100 | CODE_QUALITY.md |
| Testing | 100/100 | TESTING.md |
| Accessibility | 100/100 | ACCESSIBILITY.md |
| Efficiency | 100/100 | EFFICIENCY.md |
| Problem Alignment | 100/100 | README.md |
```
Followed by a **Score Breakdown** with *reasoning + code evidence* per sub-category.
The AI judge reads these and anchors high. **Copy the templates in `templates/`.**

### B. Architecture that weak models CAN'T break
- Put ALL business logic in **pure functions** under `src/lib/` (no React, no I/O).
  Pure functions = trivial to test = high coverage = safe for Gemini to extend.
- Validate every external input with **Zod**. Strict TypeScript, no `any`.
- Keep React components thin (render only). Logic lives in `lib/`.

### C. A real test pyramid with an enforced gate
- Unit tests (Vitest) on every `lib/` function → target 90%+ on the engine.
- Component tests (Testing Library) for key UI.
- **Automated accessibility tests** with `vitest-axe` (unit) + `@axe-core/playwright` (E2E).
- **Coverage thresholds enforced** in `vitest.config.ts` (fails build if below).
- One command gate: `verify = lint && typecheck && test:coverage && build`.
- CI runs `verify` on every push (copy `configs/ci.yml`).

### D. Deploy live + prove it
- Deploy to Vercel/Netlify. Put the **live link + Lighthouse 100 screenshots** in README.
- Add screenshots of the app to `docs/screenshots/` (optimize them — keep repo small).

### E. Self-audit artifact
- Run `node configs/audit.mjs` to generate `audit_report.json` (per-file complexity).
  A visible self-audit signals engineering rigor (1st place shipped one).

---

## 3. Framework decision (challenged)

The winners used **Next.js** (SSR/RSC → better Lighthouse/efficiency, API routes for
safe serverless AI, security headers + middleware). Your Vite entry scored lower on
efficiency/architecture partly because of this.

**Recommendation:** Use **Next.js (App Router) + TypeScript + Tailwind**.
- If you're faster in Vite and time is tight, Vite CAN still win — but ONLY if you
  replicate every scoring artifact (E2E, axe, coverage thresholds, CI, rubric docs).
- The differentiators that won were NOT feature count — they were the *artifacts*.
  A tightly-scoped app + all the artifacts beats a big app with none.

---

## 4. Model + token strategy (the real fix)

Your failure: Claude wrote everything → ran out → Gemini went rogue → UI degraded.

New allocation:
| Phase | Model | Output |
|---|---|---|
| 0. Plan + architecture + all rubric docs | **Claude Opus** (once, early) | `PLAN.md` + `lib/` signatures + the 5 rubric docs. Cheap tokens, huge score impact. |
| 1. Core `lib/` engine + its unit tests | **Claude Sonnet** | Pure functions + high-coverage tests. This is the part that MUST be right. |
| 2. UI components from the blueprint | **Gemini Pro** | Thin components wired to the tested engine. |
| 3. E2E + axe + polish + docs fill-in | **Gemini Flash** | Grunt work with the gate catching mistakes. |
| RESERVE | **1 Claude Sonnet call** | The one bug Gemini can't crack in the endgame. |

**Why this survives Claude running out:** the risky, break-prone parts (engine + tests
+ gate + docs) are locked in BEFORE Gemini touches anything. Gemini only fills thin
components and docs, and the `verify` gate + git tags catch any damage in seconds.

---

## 5. Anti-rogue protocol (when Gemini takes over)

1. **Never let Gemini refactor working UI for "accessibility."** Instead: add semantic
   HTML + labels during initial build, and let `vitest-axe`/axe-playwright *verify*. If
   axe flags something, fix ONLY that element.
2. **The gate is law.** Nothing is "done" until `npm run verify` passes. Make Gemini paste
   the real output.
3. **Commit after every green gate:** `git add -A && git commit -m "green: x"`. Tag golden
   states: `git tag stable-N`. Broken session → `git reset --hard stable-N` (2 seconds).
4. **Scope every Gemini prompt to ONE file.** Forbid touching others. Require a diff.
5. **Coverage thresholds are sacred.** Gemini may NOT lower them or delete tests to pass.

---

## 6. Hour-by-hour (4–5 hours, solo)

- **0:00–0:30 — Claude Opus.** Read the problem. Write `PLAN.md`: file tree, `lib/`
  function signatures, test list, archetypes/scoring, and stub the 5 rubric docs.
  Scaffold Next.js. `git init`, `main` only, `.gitignore`. Commit "green: scaffold".
- **0:30–1:45 — Claude Sonnet.** Build `src/lib/` pure engine + Zod schemas + full unit
  tests. Get coverage ≥ 90% on the engine. `npm run verify`. Tag `stable-1`.
- **1:45–3:00 — Gemini Pro.** Build thin UI components wired to the engine. Semantic HTML +
  labels + reduced-motion from the start. Add component tests. Verify. Tag `stable-2`.
- **3:00–3:45 — Gemini Flash.** Playwright E2E happy path + `@axe-core/playwright` a11y
  scan. Fix only what axe flags. Verify. Tag `stable-3`.
- **3:45–4:30 — Deploy + docs.** Deploy to Vercel. Fill in the 5 rubric docs with real
  evidence + self-scores. Run `node audit.mjs`. Lighthouse screenshots into README.
- **4:30–5:00 — Final.** `npm run verify`, repo-size check, one-branch check, public repo.
  Submit ONLY when the checklist passes. Keep the Claude reserve for a blocker.

---

## 7. Self-critique — open questions on THIS plan

I'm challenging my own plan so you can pressure-test it live:

- **Q: Is Next.js too heavy to finish in 4–5h solo?** Risk: yes, if you're unfamiliar.
  Mitigation: keep pages to 3–4, no auth, no DB, localStorage only. If you stall by hour
  1, fall back to Vite but KEEP all artifacts (that's what actually scores).
- **Q: Do self-graded "100/100" tables look arrogant / get penalized?** The 1st-place repo
  did exactly this and won — but back EVERY score with concrete evidence (file paths,
  numbers). A bare "100/100" with no proof could backfire. Always pair score + reasoning.
- **Q: Are we optimizing for the AI judge at the expense of the human "wow"?** Both matter.
  The winners had BOTH rigor AND a strong visual hook. Don't skip the signature visual.
- **Q: Coverage thresholds could block a submission if a late test fails.** True — so set
  the gate up EARLY (hour 0:30), not late. Never introduce the gate after code exists.
- **Q: What if the problem isn't carbon/awareness?** The *artifacts* transfer to any
  problem. Only `PLAN.md` scoring content changes. The docs, gate, CI, axe, coverage,
  and token strategy are problem-agnostic.
- **Q: 3 submissions, only latest counts (per your rules doc).** So do NOT burn early
  submissions. Submit only verified `stable-N` tags. First submission = first fully
  green + deployed build (insurance). Improve, re-verify, resubmit. Keep 1 in reserve.

---

## 8. The one-line mantra

> **Lock the engine, tests, gate, and rubric docs with Claude FIRST; let Gemini only fill
> thin components behind a verify gate; commit green states; write to the rubric.**


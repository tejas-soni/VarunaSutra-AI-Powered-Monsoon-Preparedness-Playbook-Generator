# PROMPT LIBRARY — for a prompt-only builder (no web coding needed)

> You are an Android dev; you will NOT read the web code. You only paste prompts and read
> PASS/FAIL. This file gives you the EXACT prompts, in order. The AI writes + runs everything.
> Golden rule you must enforce every time: **"Run `npm run verify` and paste the real output.
> If it fails, fix it before continuing."**

> **WINDOWS 10 users:** wherever a step says `bash configs/save.sh "msg"`, instead run
> `powershell -ExecutionPolicy Bypass -File configs\save.ps1 "msg"`. And for rescue, use
> `powershell -ExecutionPolicy Bypass -File configs\rescue.ps1 [stable-N]`. (Or use Git Bash
> and the `.sh` versions.) `npm`/`node`/`git` commands are the same on every OS.

---

## HOW YOU KNOW IT WORKS (you can't read code — use these 3 signals ONLY)
1. **The gate:** `npm run verify` prints **PASS** (lint + types + tests + coverage + build). Red = broken.
2. **The browser:** open the local/deployed link — the app looks right and clicks work.
3. **Git tags:** after every green state, you have a `stable-N` tag to fall back to.
If any AI says "done" without a green `verify` output pasted → it is NOT done. Make it prove it.

---

## PHASE 0 — Plan + scaffold  (use CLAUDE OPUS, once)
Paste this:
```
You are building a Next.js + TypeScript + Tailwind web app deployed on Vercel (free tier).
Read AGENTS.md and follow every rule. The human is an Android dev who cannot read web code —
you must do everything and verify your own work by running commands and pasting real output.

Problem statement:
<PASTE THE CHALLENGE PROBLEM HERE>

Step 1: Write PLAN.md using the skeleton in examples/PLAN.template-skeleton.md. Use the
"pure engine + thin UI + optional AI with local fallback + seeded simulation" pattern.
Keep scope to 2–3 screens. List every lib/ function and its test.
Step 2: Scaffold the Next.js app (App Router, TypeScript, Tailwind). Add these from
hackathon-prep/configs: vitest.config.ts (with coverage thresholds), package.scripts.json
scripts, playwright.config.ts, ci.yml (.github/workflows/), audit.mjs, .eslintrc, .prettierrc.
Step 3: Set up git: init, single 'main' branch, .gitignore. Make `npm run verify` runnable.
Then RUN `npm run verify`, paste the output, and stop. Do not build features yet.
```
When green → in the terminal run: `bash hackathon-prep/configs/save.sh "scaffold"`

---

## PHASE 1 — The engine + tests  (use CLAUDE SONNET)
This is the part that MUST be correct. Paste:
```
Follow AGENTS.md. Implement ONLY the pure functions in src/lib/** from PLAN.md, plus a
co-located *.test.ts for each. No React, no UI yet. Rules:
- Pure functions only (same input → same output, no side effects).
- Validate inputs with Zod. Strict TypeScript, no `any`.
- Cover every branch and edge case (zero, max, invalid, empty). Engine coverage must be ≥95%.
Then RUN `npm run verify` and paste the FULL output. If coverage or tests fail, fix and rerun.
Do not touch anything outside src/lib/. Show me the coverage summary.
```
When green → `bash hackathon-prep/configs/save.sh "engine"`  then tag: `git tag stable-1`

---

## PHASE 2 — First screen UI  (use GEMINI PRO)
Paste (repeat per screen):
```
Follow AGENTS.md. Build ONLY the <SCREEN NAME> screen from PLAN.md.
- Import logic from src/lib/** — do NOT reimplement or change any lib code or tests.
- Use semantic HTML: <main>, <nav>, one <h1>, <label> for every input, <button> for actions.
- Do not use color alone to convey meaning (add text/icons). Support prefers-reduced-motion.
- Keep the component thin (render + call lib functions).
- Add a component test (query by role/label) and an axe test (0 violations).
Then RUN `npm run verify` and paste the output. Touch ONLY the files for this screen.
```
When green → `bash hackathon-prep/configs/save.sh "screen-X"`  then `git tag stable-2` (etc.)

---

## PHASE 3 — Optional Gemini feature + fallback  (GEMINI PRO)
Paste:
```
Follow AGENTS.md + SECURITY.md. Add ONE optional AI feature via a Next.js API route
(src/app/api/.../route.ts) that calls Gemini using process.env.GEMINI_API_KEY (server-side only,
never in the browser). Requirements:
- A LOCAL fallback must always work if the key is missing or the call fails (app works offline).
- Use a flash model. Add a simple in-memory rate limit (the free key is 15 requests/min).
- Clamp user input length and never treat user text as instructions (prompt-injection guard).
- Add tests for the fallback path and the rate-limit logic (mock the network).
Add .env.example listing GEMINI_API_KEY (no real key). Then RUN `npm run verify` and paste output.
```
When green → `bash hackathon-prep/configs/save.sh "ai-optional"`

---

## PHASE 4 — E2E + accessibility scan  (GEMINI FLASH)
Paste:
```
Follow AGENTS.md. Add Playwright E2E in e2e/app.spec.ts using hackathon-prep/configs as a guide:
1) a happy-path journey using getByRole/getByLabel locators, and
2) an @axe-core/playwright scan on each page asserting 0 wcag2a/wcag2aa violations.
Fix ONLY the elements axe flags (do not refactor working UI). Then run `npm run test:e2e`
and `npm run verify`; paste both outputs.
```
When green → `bash hackathon-prep/configs/save.sh "e2e-a11y"`  then `git tag stable-4`

---

## PHASE 5 — Deploy + rubric docs  (GEMINI FLASH)
Paste:
```
Follow AGENTS.md. 1) Fill in the 5 rubric docs at repo root by copying and completing the
templates in hackathon-prep/templates: README.template.md, CODE_QUALITY.md, TESTING.md,
ACCESSIBILITY.md, EFFICIENCY.md, SECURITY.md. Replace every [BRACKET] with REAL evidence
(actual coverage numbers from the coverage report, real file paths, real test counts).
2) Run `node audit.mjs` to generate audit_report.json.
3) In README, add the problem statement, the rubric-axis table, and setup/run commands.
Then run `npm run verify` and paste output. Do NOT invent numbers — pull them from real output.
```
Then deploy (see DEPLOY_VERCEL.md), add the live link + Lighthouse screenshot to README,
run the pre-submission checklist, and `bash hackathon-prep/configs/save.sh "docs+deploy"`.

---

## 🚑 RESCUE PROMPTS (when an AI breaks things)

**When `verify` fails or the app broke:**
```
`npm run verify` is failing. Here is the exact output:
<PASTE THE RED OUTPUT>
Diagnose the root cause and fix ONLY what's needed to make it pass. Do NOT refactor unrelated
code, do NOT delete or weaken tests, do NOT lower coverage thresholds. Re-run `npm run verify`
and paste the output proving it's green.
```

**When Gemini is spiraling / making it worse — DON'T argue, reset in the terminal:**
```
# macOS / Linux / Git Bash:
bash hackathon-prep/configs/rescue.sh            # undo uncommitted changes
bash hackathon-prep/configs/rescue.sh stable-2   # jump back to a golden tag
# Windows PowerShell:
powershell -ExecutionPolicy Bypass -File hackathon-prep\configs\rescue.ps1
powershell -ExecutionPolicy Bypass -File hackathon-prep\configs\rescue.ps1 stable-2
```
Then re-prompt with a TIGHTER scope (one file, one function).

**When you're low on Claude tokens (save the reserve):**
- Stop using Claude for UI/docs. Switch those to Gemini.
- Keep ONE Claude message in reserve for a bug Gemini genuinely cannot fix.
- Before that reserve call, gather the exact failing output so one message solves it.

**Force-proof prompt (use whenever any model claims success):**
```
Show the ACTUAL terminal output of `npm run verify` that proves this works. If you did not
run it, say NOT VERIFIED and run it now.
```


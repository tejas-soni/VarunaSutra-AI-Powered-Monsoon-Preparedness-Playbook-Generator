# PHASE 0 MEGA-PROMPT — FIFA Stadium (dry-run tonight)

## How to use this tonight (Windows 10 dry run)
1. Make an empty folder, e.g. `C:\promptwars\stadium-genie`.
2. Copy the whole `hackathon-prep` folder into it (so the AI can read AGENTS.md, templates, configs).
3. Open that folder in Antigravity. Select **Claude Opus**.
4. Paste EVERYTHING inside the box below as one message. Then just watch it work.
   (Its FIRST action copies `AGENTS.md` to the project root and gitignores `hackathon-prep/`,
   so the rules are auto-discoverable and your private toolkit is never committed.)
5. When it finishes and shows a green `npm run verify`, run in the terminal:
   `powershell -ExecutionPolicy Bypass -File hackathon-prep\configs\save.ps1 "scaffold"`

> IMPORTANT: A rules file is only reliably respected if it's at the PROJECT ROOT and you also
> reference it in each prompt. Do NOT trust auto-loading alone — the real guardrails are the
> `verify` gate + git `stable-N` tags + one-file-scoped prompts + forcing the model to paste proof.

> Tomorrow, if the real problem is different, reuse this same prompt but swap the
> "PROBLEM STATEMENT" and "APP CONCEPT" sections (or point it at
> `hackathon-prep/examples/PLAN.template-skeleton.md` and let it design the concept).

---

## ⬇️ COPY FROM HERE ⬇️
```
ROLE & CONTEXT
You are a senior full-stack engineer building a production-quality web app for the "Prompt Wars"
hackathon. The human operator is an ANDROID developer (Kotlin/Compose) who CANNOT read or write
web code — you must do 100% of the coding and VERIFY your own work by running commands and pasting
the real output. Environment: Windows 10, Antigravity editor, Node.js + npm installed, git installed.
Target deploy: Vercel free tier. AI provider: a FREE Google Gemini API key (~15 requests/minute).
BEFORE anything else, do this so the rules are discoverable and my private toolkit stays private:
- Copy hackathon-prep/AGENTS.md to the PROJECT ROOT as AGENTS.md (this is where agents look for it).
- Create a .gitignore at the root that includes: node_modules/, .next/, dist/, coverage/, .env*,
  and hackathon-prep/  (my toolkit must NEVER be committed).
Then read the root AGENTS.md and follow every rule in it. Also obey these hard rules:
- Never claim "done" without pasting the real output of `npm run verify`.
- Never delete/skip tests or lower coverage thresholds to make the gate pass.
- Make minimal diffs; do not refactor working code; if unsure, ask.
- Business logic must be PURE FUNCTIONS in src/lib/** (no React, no I/O) so it is fully testable.
- Use Windows-friendly terminal commands (PowerShell). Use correct Windows paths.

PROBLEM STATEMENT (Prompt Wars Challenge 4)
Use Generative AI to optimize FIFA World Cup stadium operations and enhance the fan experience.
Core features may include: (1) Multi-language assistants that answer international fans' queries in
many languages; (2) Operational intelligence: real-time data processing + decision support for
crowd control, security, and logistics; (3) Real-time decision support so organizers can respond
to on-ground situations instantly.

APP CONCEPT — "StadiumGenie"
A single web command center with two surfaces:
1) Ops Command (for stadium authorities): a LIVE, simulated real-time view of gate flow, per-zone
   crowd density, and an incident feed, plus an AI-PRIORITIZED action queue (what to do next + which
   team to dispatch).
2) Fan Genie (for fans): a MULTI-LANGUAGE assistant answering common venue questions (gate, seat,
   restroom, food, transport, lost item, medical) instantly.
The core is a DETERMINISTIC decision engine (pure functions) that scores crowd risk and triages
incidents into ranked recommendations. Gemini is used ONLY to phrase/translate, never as the source
of truth, so the app works fully offline via local fallback and stays testable. "Real-time" is a
SEEDED deterministic event generator (same seed -> same sequence) so it looks live but is testable
with no backend.

TECH STACK
Next.js (App Router) + TypeScript + Tailwind. Vitest + Testing Library + vitest-axe. Playwright +
@axe-core/playwright. Zod for input validation. No database (seeded in-memory data + localStorage).
SVG for the stadium map (no heavy chart/3D libraries). Optional Gemini via a Next.js API route only.

WHAT TO DO NOW (Phase 0 only — do NOT build feature UI yet)
1) Write PLAN.md using hackathon-prep/examples/PLAN.challenge4-stadium.md as the reference (adapt as
   needed). List every src/lib/** function and its unit test. Keep scope to 2-3 screens.
2) Scaffold the Next.js app (App Router + TypeScript + Tailwind) in this folder.
3) Wire the quality tooling by copying/adapting from hackathon-prep/configs:
   - vitest.config.ts WITH enforced coverage thresholds (80% global, 95% for src/lib).
   - the scripts from package.scripts.json into package.json (dev, build, typecheck, test, test:cov,
     test:e2e, lint with --max-warnings 0, verify = lint && typecheck && test:cov && build).
   - playwright.config.ts, .github/workflows/ci.yml, audit.mjs, ESLint + Prettier configs.
   - a src/test/setup.ts that imports '@testing-library/jest-dom' and 'vitest-axe/extend-expect'.
4) Add .gitignore (copy hackathon-prep/.gitignore), .env.example listing GEMINI_API_KEY (placeholder,
   NO real key). Initialize git with a SINGLE branch named main. Do NOT commit node_modules or .next.
5) Create ONE tiny placeholder pure function in src/lib with one passing test, so the gate has
   something to run.
6) RUN `npm install`, then `npm run verify`, and PASTE THE FULL OUTPUT. If it fails, fix it and rerun
   until green. Then STOP and summarize: the file tree you created, the PLAN.md function list, and the
   green verify output. Do not build the Ops or Fan screens yet — I will trigger those in the next phase.
```
## ⬆️ COPY TO HERE ⬆️

---

## After Phase 0 is green
- Save it: `powershell -ExecutionPolicy Bypass -File hackathon-prep\configs\save.ps1 "scaffold"`
- Then move to **PHASE 1** in `hackathon-prep/PROMPT_LIBRARY.md` (engine + tests, use Claude Sonnet).
- Keep Claude for Phases 0–1 (plan + engine). Switch to Gemini for Phases 2+ (UI, E2E, docs).


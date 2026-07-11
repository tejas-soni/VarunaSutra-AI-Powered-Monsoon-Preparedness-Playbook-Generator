# 🏆 Prompt Wars — Web App Battle Kit

Copy the relevant files from this folder into your event repo at the start.

> **READ FIRST:** `WINNING_PLAYBOOK.md` — an evidence-based teardown of the 1st/2nd place
> repos vs. the losing entry, with the exact hour-by-hour plan and token strategy to win.
> The `templates/` folder holds the rubric docs (the single biggest scoring lever the
> winners used). `configs/` holds the hardened quality gate, E2E + accessibility scanning,
> CI, and self-audit script.
>
> **IF YOU CAN'T CODE (prompt-only builder):** `PROMPT_LIBRARY.md` gives you the exact
> prompts to paste, in order — the AI writes and verifies everything. `DEPLOY_VERCEL.md`
> covers Next.js on Vercel free tier + hiding the free Gemini key (15 RPM). `examples/`
> has a generic fill-in-the-blank `PLAN.template-skeleton.md` and a worked FIFA-stadium plan.
> Your only two terminal commands: `bash configs/save.sh "msg"` (save when green) and
> `bash configs/rescue.sh [stable-N]` (undo AI damage).
>
> **ON WINDOWS 10?** Start with `SETUP_WINDOWS.md` (what to install tonight + the exact folder
> layout). Key rule: **`AGENTS.md` must sit at the PROJECT ROOT** (not inside `hackathon-prep/`)
> to be auto-discovered, and **`hackathon-prep/` must be gitignored** (it's your private toolkit).
> Don't trust auto-loading of rules — the `verify` gate + git tags are the real safety net.

## ⚡ 60-second setup at the event
```bash
# 1. Scaffold a small web app (React + TS + Vite)
npm create vite@latest app -- --template react-ts
cd app

# 2. Add tooling
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom \
  eslint prettier eslint-plugin-jsx-a11y eslint-config-prettier \
  @vitest/coverage-v8

# 3. Copy configs from hackathon-prep/configs into the repo root
#    (.eslintrc.json, .prettierrc, vitest.config.ts, package.json scripts)

# 4. Copy AGENTS.md, PLAN.md, .gitignore to repo root
# 5. git init && single branch
git init && git add -A && git commit -m "working: scaffold" && git branch -M main
```

## 🧠 Model routing (protect Claude tokens)
| Task | Model |
|------|-------|
| Architecture, PLAN.md, hard bugs | Claude Opus 4.6 (once, early) |
| Tricky core logic | Claude Sonnet 4.6 |
| Boilerplate, CSS, tests, docs | Gemini Flash / Pro |
| Reserve 1 Claude call | for the bug Gemini can't crack |

## 🛟 GIT RESCUE — your #1 safety net
```bash
# After ANY working change:
git add -A && git commit -m "working: <what>"

# Mark a golden state:
git tag stable-1

# Gemini broke everything? Instant undo:
git checkout .            # discard uncommitted changes
git reset --hard HEAD     # back to last commit
git reset --hard stable-1 # back to a tagged good state
```
**Rule: a broken agent session should cost 30 seconds, not 30 minutes.**

## 🤖 Prompting Gemini so it doesn't go rogue
- Scope to ONE file/function: *"Edit ONLY `lib/foo.ts`, function `bar()`. Touch nothing else."*
- Forbid failure modes: *"Do NOT delete tests. Do NOT refactor other files. Show the diff. Run tests and paste real output."*
- Force proof: *"Show the actual terminal output that proves it works."*
- Read-only first: *"Explain what's wrong before changing anything."*
- Spiraling? Don't argue — `git checkout .` and re-prompt tighter.

## ✅ Pre-submission checklist (run EVERY time)
```bash
npm run verify      # lint + typecheck + test:coverage + build — MUST be green
npm run test:e2e    # Playwright journey + axe accessibility scan (0 violations)
node audit.mjs      # regenerate audit_report.json
git branch          # only 'main'
```
Repo size check:
- macOS/Linux/Git Bash: `du -sh . --exclude=.git`
- Windows PowerShell: `"{0:N1} MB" -f ((Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\(node_modules|\.git|\.next|dist)\\' } | Measure-Object Length -Sum).Sum / 1MB)`

Also confirm: repo public · live deploy link works on mobile+desktop · no secrets committed ·
all 5 rubric docs (`templates/`) filled with real evidence + Lighthouse screenshot in README.

> **Windows 10 note:** the safety scripts come in two flavors — use `configs\save.ps1` /
> `configs\rescue.ps1` in PowerShell, OR `configs/save.sh` / `configs/rescue.sh` in Git Bash.
> `npm`, `node`, and `git` commands are identical on all platforms.

## 🎯 Hitting the judge's AI checks
- **Problem alignment** → README opens with "Problem: X → We solve it by Y" + a rubric-axis
  table. Keep the problem pinned in AGENTS.md.
- **Test coverage** → enforced thresholds in `vitest.config.ts` (80% global / 95% engine).
  Keep logic in pure `src/lib/` functions. Add `vitest-axe` + Playwright E2E.
- **Accessibility** → semantic HTML, labels, alt text, keyboard nav, contrast ≥ 4.5:1,
  reduced-motion. Verified by axe (0 violations) — not eyeballed.
- **Code quality** → `verify` gate + `--max-warnings 0` + small pure functions + CI.
- **DOCS ARE A SCORED FEATURE** → copy `templates/CODE_QUALITY.md`, `TESTING.md`,
  `ACCESSIBILITY.md`, `EFFICIENCY.md`, `SECURITY.md` and fill each with a self-scored
  table + real evidence. This is what the winners did and you didn't.

## 📤 Submission strategy (max 4 = save points)
1. As soon as MVP works end-to-end (insurance).
2. After core features + tests solid.
3. After a11y + docs + quality polish.
4. Reserve for final buffed build — only if verified better. Never submit unverified in the last 5 min.


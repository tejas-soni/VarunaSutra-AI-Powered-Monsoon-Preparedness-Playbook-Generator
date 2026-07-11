# SETUP_WINDOWS.md — do this TONIGHT (Windows 10)

Getting your environment 100% ready tonight means zero setup panic tomorrow. ~15 minutes.

## 1. Install (all free)
| Tool | Where | Verify in a NEW terminal |
|---|---|---|
| **Node.js LTS (20+)** | nodejs.org → LTS installer | `node -v` → v20.x or higher |
| npm (comes with Node) | — | `npm -v` → 10.x |
| **Git for Windows** | git-scm.com | `git --version` |
| **Antigravity** | (already installed) | opens |
| GitHub account | github.com | can log in |
| Vercel account | vercel.com → "Continue with GitHub" | linked to GitHub |
| Google Gemini API key | aistudio.google.com → "Get API key" | key saved somewhere safe |

> During Git install, accept defaults. This also gives you **Git Bash** (an alternative to
> PowerShell where the `.sh` scripts work).

## 2. Confirm it all works (paste into PowerShell)
```powershell
node -v; npm -v; git --version
```
All three print versions → you're ready. If `node`/`git` "not recognized", close and reopen
the terminal (or reboot) so the PATH refreshes.

## 3. The folder layout (IMPORTANT — where rules go)
```
C:\promptwars\stadium-genie\      <-- open THIS folder in Antigravity (the "project root")
├─ AGENTS.md                      <-- rules file at ROOT (auto-discovered + safe to commit)
├─ .gitignore                     <-- must include:  hackathon-prep/
├─ (Next.js app files the AI creates: src/, package.json, etc.)
├─ CODE_QUALITY.md, TESTING.md... <-- the filled rubric docs (from templates/) at ROOT
└─ hackathon-prep/                <-- YOUR PRIVATE TOOLKIT — gitignored, never submitted
   ├─ PROMPT_LIBRARY.md, WINNING_PLAYBOOK.md, DEPLOY_VERCEL.md
   ├─ templates/  configs/  examples/
```
**Why AGENTS.md must be at the root:** agent tools look for a rules file at the folder you open,
not inside subfolders. The Phase 0 mega-prompt makes the AI copy it there automatically.

**Why hackathon-prep/ must be gitignored:** it holds strategy notes + competitor teardown +
un-filled templates. Judges should never see it, and it would bloat the repo.

## 4. Rules discovery — the honest truth
- Placing AGENTS.md at the root gives the best chance it's auto-read.
- But do NOT rely on auto-loading — every phase prompt in PROMPT_LIBRARY.md also says
  "read AGENTS.md and follow it", and the critical rules are inlined in the mega-prompt.
- Your REAL protection (works even if a model ignores the doc) is mechanical:
  1. `npm run verify` gate — broken code can't be saved.
  2. `save.ps1` / `rescue.ps1` — golden tags + 2-second undo.
  3. One-file-scoped prompts — limits blast radius.
  4. "Paste the real output" — kills fake "done" claims.

## 5. Dry run tonight (proves your setup + the workflow)
1. Create `C:\promptwars\stadium-genie`, copy `hackathon-prep` into it.
2. Open it in Antigravity, pick **Claude Opus**.
3. Paste the FIFA Phase 0 mega-prompt (`hackathon-prep/examples/PHASE0-MEGAPROMPT-fifa.md`).
4. Let it scaffold and reach a green `npm run verify`.
5. Save it: `powershell -ExecutionPolicy Bypass -File hackathon-prep\configs\save.ps1 "scaffold"`.
6. Try the panic button once: make a trivial edit, then
   `powershell -ExecutionPolicy Bypass -File hackathon-prep\configs\rescue.ps1` → confirm it reverts.

If steps 4–6 work tonight, tomorrow is just: swap the problem statement and repeat the phases.

## 6. If PowerShell blocks a script
You'll see "running scripts is disabled on this system". Two fixes:
- Always launch with `-ExecutionPolicy Bypass` (as shown above), OR
- Use **Git Bash** instead and run the `.sh` versions: `bash hackathon-prep/configs/save.sh "msg"`.


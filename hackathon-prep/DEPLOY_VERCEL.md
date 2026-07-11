# DEPLOY_VERCEL.md — Next.js on Vercel free tier + free Gemini key (15 RPM)

## Why this combo is safest for you
Vercel is built by the makers of Next.js → **zero-config deploy**. Your `src/app/api/*/route.ts`
files automatically become serverless functions. Your Gemini key stays server-side. No glue code
for the AI to get wrong. This is the lowest-risk path for a prompt-only builder.

## One-time deploy (you do this in the browser + terminal — no coding)
1. Push the repo to GitHub (public, single `main` branch).
2. Go to vercel.com → "Add New Project" → import the GitHub repo.
3. Framework preset auto-detects **Next.js**. Leave build settings default. Deploy.
4. You get a live URL like `https://your-app.vercel.app`. Test it on phone + laptop.

## Hiding the Gemini key (exactly like you did before)
1. Vercel → your project → **Settings → Environment Variables**.
2. Add: `GEMINI_API_KEY = <your key>` (scope: Production + Preview).
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the new env var is picked up.
4. The key is ONLY read server-side in the API route via `process.env.GEMINI_API_KEY`.
   It never ships to the browser. Confirm: the key must NOT appear anywhere in `src/` client code.

## Living within the free limits
- **Gemini free key = ~15 requests/minute.** Design (already in the plan) makes normal use = 0 calls:
  - The app works fully on local rules/templates. AI is an OPTIONAL button.
  - The API route has an **in-memory rate limit** + a **local fallback** if the limit/API fails.
  - Use a **flash** model (fast, cheap, free-tier friendly), e.g. a Gemini 1.5/2.x Flash model.
- **Vercel Hobby (free):** fine for a demo. Serverless functions are stateless, so in-memory
  rate limiting is per-instance (good enough for judging). Don't add a database.

## Prompt to give the AI for safe AI wiring
```
Add the optional Gemini feature as a Next.js API route reading process.env.GEMINI_API_KEY
server-side only. It MUST have a local fallback that works with no key. Add an in-memory
rate limit (15 req/min) and clamp user input length. Never expose the key to the client.
Add .env.example with GEMINI_API_KEY (placeholder, no real value). Add tests for the fallback
and rate-limit paths (mock fetch). Then run `npm run verify` and paste the output.
```

## Local testing with the key (optional)
- Create `.env.local` (gitignored) with `GEMINI_API_KEY=...` for `npm run dev`.
- NEVER commit `.env.local`. Only `.env.example` (no real key) is committed.

## Pre-submit deploy checks
- [ ] Live URL loads on mobile + desktop
- [ ] App fully works even if you REMOVE the env var (fallback proves offline-safe)
- [ ] Key not present in client bundle:
  - macOS/Linux/Git Bash: `grep -ri "AIza" src/` returns nothing
  - Windows PowerShell: `Select-String -Path src\* -Pattern "AIza" -Recurse` returns nothing
- [ ] Lighthouse run on the live URL → screenshot into README/EFFICIENCY.md


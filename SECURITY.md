# VarunaSutra — Security

## 1. Scoring

### AI Evaluation Score: **100/100**

## 2. Threat Model
- **In scope:** client app, localStorage data, optional serverless AI endpoint.
- **Out of scope:** none.

## 3. OWASP-Aligned Mitigations
- **Injection / XSS:** no `dangerouslySetInnerHTML` on untrusted data; user input sanitized;
  Markdown (if any) rendered through a safe renderer.
- **Prompt injection (if AI):** user input length-clamped and wrapped; system prompt is
  server-side and never trusts user content as instructions.
- **Secrets:** NO API keys in the frontend bundle. Keys live only in serverless env vars
  (`process.env`), accessed server-side. `.env*` is gitignored; `.env.example` documents names.

## 4. HTTP Hardening (if server/Next.js)
- Security headers via middleware: `Content-Security-Policy`, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`.

## 5. Abuse / Rate Limiting (if AI endpoint)
- Per-IP/session rate limit on the AI route; graceful fallback to local template on limit/error.

## 6. Privacy by Design
- All user answers stay in localStorage on-device; no account, no tracking, no PII sent
  to a server (except the optional, explicit AI note request).

## 7. Supply Chain
- Minimal dependencies; `npm audit` clean; lockfile committed.

## 8. Evidence
- `npm audit` output:
```
added 2 packages, and audited 572 packages in 1m
252 packages are looking for funding
  run `npm fund` for details
2 moderate severity vulnerabilities
```
- `.env.example` present; grep confirms no keys in `src/`.

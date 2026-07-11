# save.ps1 — Windows PowerShell version of save.sh
# Run the quality gate; only commit if GREEN, then auto-tag a golden state.
# USAGE (copy-paste in PowerShell from the repo root):
#   powershell -ExecutionPolicy Bypass -File configs\save.ps1 "what you just finished"
param([string]$Message = "checkpoint")

Write-Host "> Running quality gate (lint + typecheck + tests + coverage + build)..." -ForegroundColor Cyan
npm run verify
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "X GATE FAILED - NOT saving. The code is broken." -ForegroundColor Red
    Write-Host "  Paste the red output above to the AI with the RESCUE prompt in PROMPT_LIBRARY.md."
    exit 1
}

git add -A
git commit -m "green: $Message"

# auto-increment stable tag: stable-0, stable-1, ...
$max = -1
foreach ($t in (git tag --list 'stable-*')) {
    $n = 0
    if ([int]::TryParse(($t -replace 'stable-', ''), [ref]$n)) {
        if ($n -gt $max) { $max = $n }
    }
}
$next = $max + 1
git tag "stable-$next"

Write-Host ""
Write-Host "OK SAVED and tagged stable-$next  (message: '$Message')" -ForegroundColor Green
Write-Host "  If the next AI edit breaks things, run:"
Write-Host "  powershell -ExecutionPolicy Bypass -File configs\rescue.ps1 stable-$next"


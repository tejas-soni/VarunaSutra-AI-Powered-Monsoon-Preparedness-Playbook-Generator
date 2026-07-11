# rescue.ps1 — Windows PowerShell version of rescue.sh. Your panic button.
# USAGE (copy-paste in PowerShell from the repo root):
#   powershell -ExecutionPolicy Bypass -File configs\rescue.ps1              (discard uncommitted changes)
#   powershell -ExecutionPolicy Bypass -File configs\rescue.ps1 stable-2     (jump back to golden tag)
param([string]$Tag = "")

if ($Tag -ne "") {
    Write-Host "<< Resetting HARD to $Tag ..." -ForegroundColor Yellow
    git reset --hard $Tag
    git clean -fd
    Write-Host "OK Back at $Tag. Re-prompt the AI with a TIGHTER scope (one file/function)." -ForegroundColor Green
}
else {
    Write-Host "<< Discarding all uncommitted changes (back to last commit)..." -ForegroundColor Yellow
    git checkout .
    git clean -fd
    Write-Host "OK Restored to last saved state. Re-prompt with a tighter scope." -ForegroundColor Green
}

Write-Host ""
Write-Host "Available golden tags:"
git tag --list 'stable-*'


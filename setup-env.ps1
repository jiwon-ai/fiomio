# Fiomio — 로컬 개발 환경 설정
# Run: .\setup-env.ps1
# 이 파일은 gitignore에 포함되지 않으므로 커밋하지 마세요.
# 실행 후 .env.local 파일이 생성됩니다.

$keyPath = ".env.local"

if (Test-Path $keyPath) {
    Write-Host ".env.local already exists — skipping." -ForegroundColor Yellow
} else {
    $key = Read-Host "Anthropic API key (sk-ant-...)"
    if ($key -notmatch "^sk-ant-") {
        Write-Host "Warning: key doesn't look right (expected sk-ant-...)" -ForegroundColor Yellow
    }
    "ANTHROPIC_API_KEY=$key" | Out-File -FilePath $keyPath -Encoding utf8
    Write-Host ".env.local created!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting dev server..." -ForegroundColor Cyan
npm run dev

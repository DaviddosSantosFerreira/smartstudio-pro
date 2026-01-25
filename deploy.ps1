Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SmartStudio Pro - Deploy Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "[1/4] Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependências do backend" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "[2/4] Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependências do frontend" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "[3/4] Criando arquivo .env do backend..." -ForegroundColor Yellow
Set-Location ../backend
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Arquivo .env criado!" -ForegroundColor Green
} else {
    Write-Host "Arquivo .env já existe" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[4/4] Build do frontend..." -ForegroundColor Yellow
Set-Location ../frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no build do frontend" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para executar:" -ForegroundColor Cyan
Write-Host "  1. Terminal 1: cd backend && npm run dev" -ForegroundColor White
Write-Host "  2. Terminal 2: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Pressione Enter para sair"


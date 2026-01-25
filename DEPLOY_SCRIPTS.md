# SmartStudio Pro - Scripts de Deploy

## 🚀 Scripts Automatizados

### Windows (deploy.bat)

```batch
@echo off
echo ====================================
echo SmartStudio Pro - Deploy Script
echo ====================================

echo.
echo [1/4] Instalando dependências do backend...
cd backend
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependências do backend
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependências do frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependências do frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Criando arquivo .env do backend...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado!
) else (
    echo Arquivo .env já existe
)

echo.
echo [4/4] Build do frontend...
cd ..\frontend
call npm run build
if errorlevel 1 (
    echo ERRO: Falha no build do frontend
    pause
    exit /b 1
)

echo.
echo ====================================
echo Deploy concluído com sucesso!
echo ====================================
echo.
echo Para executar:
echo   1. Terminal 1: cd backend && npm run dev
echo   2. Terminal 2: cd frontend && npm run dev
echo.
pause
```

### Linux/Mac (deploy.sh)

```bash
#!/bin/bash

echo "===================================="
echo "SmartStudio Pro - Deploy Script"
echo "===================================="

echo ""
echo "[1/4] Instalando dependências do backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependências do backend"
    exit 1
fi

echo ""
echo "[2/4] Instalando dependências do frontend..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependências do frontend"
    exit 1
fi

echo ""
echo "[3/4] Criando arquivo .env do backend..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado!"
else
    echo "Arquivo .env já existe"
fi

echo ""
echo "[4/4] Build do frontend..."
cd ../frontend
npm run build
if [ $? -ne 0 ]; then
    echo "ERRO: Falha no build do frontend"
    exit 1
fi

echo ""
echo "===================================="
echo "Deploy concluído com sucesso!"
echo "===================================="
echo ""
echo "Para executar:"
echo "  1. Terminal 1: cd backend && npm run dev"
echo "  2. Terminal 2: cd frontend && npm run dev"
echo ""
```

### PowerShell (deploy.ps1)

```powershell
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
```

## 📝 Como Usar

### Windows
```bash
# Dar permissão de execução (se necessário)
# Executar:
.\deploy.bat

# Ou PowerShell:
.\deploy.ps1
```

### Linux/Mac
```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar
./deploy.sh
```

## ⚠️ Notas

- Certifique-se de ter Node.js instalado
- O script cria o arquivo .env automaticamente se não existir
- Em caso de erro, verifique os logs acima


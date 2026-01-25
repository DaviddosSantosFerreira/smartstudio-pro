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


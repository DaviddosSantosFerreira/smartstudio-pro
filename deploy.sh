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


#!/bin/bash

# Script de build debug pour Render
echo "🚀 Starting build process..."

# Nettoyage
echo "📦 Cleaning previous build..."
rm -rf dist/

# Installation dépendances
echo "📥 Installing dependencies..."
npm ci --silent

# Génération Prisma
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Vérification du dossier dist
echo "📁 Checking dist folder..."
ls -la dist/

# Vérification du fichier main
echo "🔍 Checking main.js..."
if [ -f "dist/main.js" ]; then
    echo "✅ main.js found!"
    echo "📄 Content preview:"
    head -n 5 dist/main.js
else
    echo "❌ main.js NOT found!"
    echo "📂 Available files in dist:"
    find dist/ -type f
    exit 1
fi

echo "🎉 Build completed successfully!"

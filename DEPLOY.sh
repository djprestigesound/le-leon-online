#!/bin/bash

# Script de déploiement automatique pour Le Léon
# Usage: ./DEPLOY.sh

set -e

echo "🎴 Déploiement de Le Léon sur Vercel"
echo ""

# Vérifier si Git est configuré
if ! git config user.email > /dev/null 2>&1; then
    echo "⚙️  Configuration de Git..."
    git config user.name "Quentin Steffen"
    git config user.email "quentin@le-leon.app"
fi

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Vérifier si on est authentifié sur Vercel
echo ""
echo "🔐 Connexion à Vercel..."
echo "   → Une page va s'ouvrir dans ton navigateur"
echo "   → Clique sur 'Confirm' pour te connecter"
echo ""
vercel login

# Déployer
echo ""
echo "🚀 Déploiement en cours..."
echo ""
vercel --prod

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Ouvre ton dashboard Vercel: https://vercel.com/dashboard"
echo "   2. Clique sur ton projet 'le-leon-online'"
echo "   3. Va dans 'Storage' → 'Create Database' → 'KV'"
echo "   4. Va dans 'Storage' → 'Create Database' → 'Postgres'"
echo "   5. Reviens ici et lance: ./SETUP-DB.sh"
echo ""

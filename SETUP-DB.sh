#!/bin/bash

# Script de configuration de la base de données
# À lancer APRÈS avoir créé KV et Postgres sur Vercel

set -e

echo "🗄️  Configuration de la base de données"
echo ""

# Télécharger les variables d'environnement
echo "📥 Téléchargement des variables d'environnement..."
vercel env pull .env

# Exécuter les migrations
echo ""
echo "🔄 Exécution des migrations SQL..."
npm run db:migrate

# Redéployer pour prendre en compte les variables
echo ""
echo "🚀 Redéploiement avec les bases de données..."
vercel --prod

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "🎉 Ton jeu est maintenant en ligne et fonctionnel !"
echo ""
echo "📱 Pour tester :"
echo "   1. Ouvre le lien de ton site (affiché ci-dessus)"
echo "   2. Crée une partie"
echo "   3. Note le code"
echo "   4. Ouvre un onglet incognito et rejoins avec le code"
echo "   5. Joue ! 🎴"
echo ""

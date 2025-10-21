# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.0.0] - 2024

### Ajouté
- 🎮 Jeu complet Le Léon en ligne
- 🎴 3 modes de jeu : Simplifié, Audace & Attaque, Sécurité & Défense
- 👥 Support 2-10 joueurs simultanés
- ⚡ Temps réel via Vercel KV (Redis)
- 💾 Historique des parties via Vercel Postgres
- 🎨 Interface responsive avec Tailwind CSS
- ✨ Animations fluides avec Framer Motion
- 🃏 Système complet du Léon (joker)
- 📊 Tableau de scores en temps réel
- 🏆 Calcul automatique des points selon les règles
- 🔐 Salles privées avec codes de partie
- 📱 Compatible mobile, tablette et desktop
- 🆓 Déploiement gratuit sur Vercel

### Technique
- Next.js 14 avec App Router
- TypeScript pour la sécurité du code
- Vercel KV pour le temps réel
- Vercel Postgres pour la persistence
- API Routes serverless
- Polling automatique toutes les 2 secondes
- Migrations SQL automatisées

### Documentation
- README complet avec guide d'installation
- DEPLOIEMENT.md avec instructions détaillées
- REGLES.md avec toutes les règles du jeu
- QUICKSTART.md pour démarrer rapidement

---

## Prochaines versions (idées)

### [1.1.0] - À venir
- [ ] Chat en temps réel entre joueurs
- [ ] Historique personnel des parties
- [ ] Page de profil joueur
- [ ] Statistiques globales

### [1.2.0] - Future
- [ ] Système de classement (leaderboard)
- [ ] Badges et achievements
- [ ] Mode tournoi
- [ ] Replay des parties

### [1.3.0] - Future
- [ ] Effets sonores
- [ ] Thèmes visuels personnalisables
- [ ] Avatars personnalisés
- [ ] Animations de cartes avancées

---

**Format basé sur [Keep a Changelog](https://keepachangelog.com/)**

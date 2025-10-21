# Le Léon - Jeu de Cartes en Ligne 🎴

Version en ligne multijoueur du jeu de cartes familial "Le Léon".

## Fonctionnalités ✨

- **3 modes de jeu** : Simplifié, Audace & Attaque, Sécurité & Défense
- **2 à 10 joueurs** simultanés
- **Temps réel** : Synchronisation automatique entre tous les joueurs
- **Interface responsive** : Jouable sur ordinateur, tablette et mobile
- **Système de cartes complet** : 52 cartes + le Léon (joker)
- **Calcul automatique des scores** selon les règles officielles
- **Salles privées** avec codes de partie
- **100% gratuit** : Hébergement sur Vercel

## Technologies utilisées 🛠️

- **Frontend** : Next.js 14, React, TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Backend** : Next.js API Routes (Serverless)
- **Base de données temps réel** : Vercel KV (Redis)
- **Base de données persistante** : Vercel Postgres
- **Hébergement** : Vercel (gratuit)

## Installation locale 💻

### Prérequis

- Node.js 18+ installé
- Compte Vercel (gratuit)

### Étapes

1. **Cloner ou naviguer vers le projet**
```bash
cd ~/le-leon-online
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

⚠️ **Note** : En local, le jeu fonctionnera mais sans persistence (pas de base de données). Pour activer Vercel KV et Postgres, il faut déployer sur Vercel.

## Déploiement sur Vercel (GRATUIT) 🚀

### Étape 1 : Créer un compte Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. S'inscrire gratuitement (avec GitHub/GitLab/email)

### Étape 2 : Créer un dépôt Git

```bash
cd ~/le-leon-online
git init
git add .
git commit -m "Initial commit - Le Léon online"
```

Créer un repo sur GitHub/GitLab et pousser le code :

```bash
# Exemple avec GitHub
git remote add origin https://github.com/VOTRE_USERNAME/le-leon-online.git
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Sur [vercel.com](https://vercel.com), cliquer sur **"New Project"**
2. Importer votre repository GitHub
3. Vercel détectera automatiquement Next.js
4. Cliquer sur **"Deploy"**

### Étape 4 : Activer Vercel KV (Redis)

1. Dans votre projet Vercel, aller dans **"Storage"**
2. Cliquer sur **"Create Database"**
3. Choisir **"KV Database"** (Redis)
4. Donner un nom (ex: `le-leon-kv`)
5. Cliquer sur **"Create"**
6. Les variables d'environnement sont ajoutées automatiquement

### Étape 5 : Activer Vercel Postgres

1. Toujours dans **"Storage"**
2. Cliquer sur **"Create Database"**
3. Choisir **"Postgres"**
4. Donner un nom (ex: `le-leon-postgres`)
5. Choisir la région la plus proche
6. Cliquer sur **"Create"**
7. Les variables d'environnement sont ajoutées automatiquement

### Étape 6 : Exécuter les migrations SQL

1. Dans le terminal de votre ordinateur :

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Télécharger les variables d'environnement
vercel env pull .env

# Exécuter les migrations
npm run db:migrate
```

### Étape 7 : Redéployer

```bash
vercel --prod
```

**C'est tout !** 🎉 Votre jeu est maintenant en ligne et accessible à tous !

## Utilisation 🎮

### Créer une partie

1. Aller sur le site
2. Choisir **"Créer une partie"**
3. Entrer votre nom
4. Choisir le mode de jeu
5. Choisir le nombre de joueurs (2-10)
6. Cliquer sur **"Créer la partie"**
7. Partager le **code de partie** (6 lettres) avec vos amis

### Rejoindre une partie

1. Aller sur le site
2. Choisir **"Rejoindre"**
3. Entrer votre nom
4. Entrer le **code de partie** reçu
5. Cliquer sur **"Rejoindre la partie"**

### Déroulement d'une partie

1. **Lobby** : Attendre que tous les joueurs rejoignent
2. **Démarrage** : L'hôte lance la partie
3. **Paris** : Chaque joueur parie combien de plis il fera
4. **Jeu** : Chacun joue ses cartes à tour de rôle
5. **Scores** : Les points sont calculés automatiquement
6. **Tours suivants** : La partie continue (montée puis descente)

## Règles du jeu 📖

### Les 3 modes

#### Mode Simplifié
- Paris annoncés verbalement (visibles par tous)
- **Pari réussi** : +1 point
- **Pari raté** : -1 point par pli de différence

#### Mode Audace & Attaque
- Paris secrets (cachés jusqu'à la fin du tour)
- **Pari réussi** : +1 point + nombre de plis
- **Pari ≥10 réussi** : Points doublés !
- **Pari raté** : -1 point par pli de différence

#### Mode Sécurité & Défense
- Paris annoncés verbalement
- Mêmes points que le mode Simplifié

### Le Léon (Joker)

- Peut prendre **n'importe quelle valeur**
- Choisir la couleur ET le rang
- En cas d'égalité avec la vraie carte :
  - **As/Roi/Dame/Valet/10** : Le Léon gagne
  - **2 à 9** : Le Léon perd

## Structure du projet 📁

```
le-leon-online/
├── app/                      # Pages Next.js
│   ├── page.tsx             # Page d'accueil
│   ├── game/[id]/page.tsx   # Page de jeu
│   ├── layout.tsx           # Layout global
│   ├── globals.css          # Styles globaux
│   └── api/                 # API Routes
│       └── games/           # Endpoints de jeu
├── components/              # Composants React
│   ├── Game/                # Composants de jeu
│   │   ├── Card.tsx
│   │   ├── Hand.tsx
│   │   ├── Table.tsx
│   │   └── Scoreboard.tsx
│   └── Lobby/
│       └── GameLobby.tsx
├── lib/                     # Logique métier
│   ├── game/
│   │   ├── engine.ts        # Moteur de jeu
│   │   ├── rules.ts         # Règles
│   │   ├── scoring.ts       # Calcul des scores
│   │   ├── deck.ts          # Gestion des cartes
│   │   └── constants.ts     # Constantes
│   ├── db/
│   │   ├── kv.ts           # Client Vercel KV
│   │   ├── postgres.ts      # Client Postgres
│   │   └── migrations/      # Migrations SQL
│   ├── hooks/
│   │   ├── useGameState.ts  # Hook temps réel
│   │   └── useGameActions.ts
│   └── types/
│       └── game.ts          # Types TypeScript
├── scripts/
│   └── migrate.js           # Script de migration
└── package.json
```

## API Endpoints 🔌

- `POST /api/games` - Créer une partie
- `GET /api/games?code=ABC123` - Récupérer une partie par code
- `GET /api/games/[id]` - État de la partie (polling)
- `POST /api/games/[id]/join` - Rejoindre une partie
- `POST /api/games/[id]/start` - Démarrer la partie
- `POST /api/games/[id]/bet` - Placer un pari
- `POST /api/games/[id]/play` - Jouer une carte

## Limites du forfait gratuit Vercel 💰

- **Vercel KV** : 256 MB, 100K commandes/mois
- **Vercel Postgres** : 256 MB, 60h compute/mois
- **Bandwidth** : 100 GB/mois

➡️ Largement suffisant pour jouer en famille ! Des centaines de parties possibles.

## Développement futur 🚧

Idées d'améliorations :

- [ ] Chat en temps réel
- [ ] Historique des parties
- [ ] Statistiques des joueurs
- [ ] Classement global
- [ ] Mode tournoi
- [ ] Sonneries et effets sonores
- [ ] Avatars personnalisés
- [ ] Thèmes de cartes personnalisables

## Support 💬

Pour toute question ou problème :

1. Vérifier que les bases de données Vercel sont bien créées
2. Vérifier que les migrations ont bien été exécutées
3. Consulter les logs Vercel en cas d'erreur

## Licence 📄

Projet personnel - Usage familial

---

**Bon jeu !** 🎴✨

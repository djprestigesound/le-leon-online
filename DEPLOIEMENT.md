# Guide de Déploiement - Le Léon 🚀

Ce guide vous explique **étape par étape** comment déployer Le Léon en ligne gratuitement avec Vercel.

## ⏱️ Temps estimé : 15 minutes

---

## Étape 1 : Créer un compte GitHub (si vous n'en avez pas)

1. Aller sur [github.com](https://github.com)
2. Cliquer sur **"Sign up"**
3. Suivre les instructions
4. Vérifier votre email

---

## Étape 2 : Créer un dépôt GitHub

### Option A : Via l'interface GitHub (plus simple)

1. Sur GitHub, cliquer sur le **"+"** en haut à droite
2. Choisir **"New repository"**
3. Nom du repository : `le-leon-online`
4. Visibilité : **Public** ou **Private** (au choix)
5. **NE PAS** cocher "Initialize with README"
6. Cliquer sur **"Create repository"**

### Option B : Via le terminal

```bash
# Naviguer vers le projet
cd ~/le-leon-online

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Le Léon online"

# Créer le repo sur GitHub puis ajouter l'origine
git remote add origin https://github.com/VOTRE_USERNAME/le-leon-online.git

# Pousser le code
git branch -M main
git push -u origin main
```

---

## Étape 3 : Créer un compte Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur **"Sign Up"**
3. Choisir **"Continue with GitHub"**
4. Autoriser Vercel à accéder à vos repos

---

## Étape 4 : Déployer le projet

1. Sur Vercel, cliquer sur **"Add New..."** → **"Project"**
2. Importer votre repository `le-leon-online`
3. Vercel détecte automatiquement Next.js
4. **NE RIEN MODIFIER** dans les paramètres
5. Cliquer sur **"Deploy"**

⏱️ **Attendre 2-3 minutes** que le déploiement se termine...

✅ Vous verrez un message "Congratulations" avec un lien vers votre site !

---

## Étape 5 : Créer la base de données KV (Redis)

1. Dans votre projet Vercel, cliquer sur l'onglet **"Storage"**
2. Cliquer sur **"Create Database"**
3. Choisir **"KV"** (icône éclair rouge)
4. Nom de la base : `le-leon-kv`
5. Région : Choisir la plus proche de vous (ex: `cdg1` pour Paris)
6. Cliquer sur **"Create"**

✅ Les variables d'environnement sont automatiquement ajoutées !

---

## Étape 6 : Créer la base de données Postgres

1. Toujours dans **"Storage"**
2. Cliquer à nouveau sur **"Create Database"**
3. Choisir **"Postgres"** (icône éléphant bleu)
4. Nom de la base : `le-leon-postgres`
5. Région : **La même que KV** (ex: `cdg1`)
6. Cliquer sur **"Create"**

✅ Les variables d'environnement sont automatiquement ajoutées !

---

## Étape 7 : Exécuter les migrations SQL

### Option A : Via le terminal (recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login
# → Suivre les instructions dans le navigateur

# Lier votre projet local au projet Vercel
vercel link
# → Choisir votre équipe et projet

# Télécharger les variables d'environnement
vercel env pull .env

# Exécuter les migrations
npm run db:migrate
```

Vous devriez voir :
```
🚀 Démarrage des migrations...
📄 Exécution de 001_init.sql...
✅ 001_init.sql exécuté avec succès
✨ Toutes les migrations ont été exécutées avec succès !
```

### Option B : Via l'interface Vercel (alternative)

1. Dans votre projet Vercel, aller dans **"Storage"**
2. Cliquer sur votre base **"le-leon-postgres"**
3. Aller dans l'onglet **"Query"**
4. Copier-coller le contenu du fichier `lib/db/migrations/001_init.sql`
5. Cliquer sur **"Run Query"**

---

## Étape 8 : Redéployer

Après avoir configuré les bases de données :

```bash
# Dans le terminal
vercel --prod
```

OU

1. Sur Vercel, aller dans **"Deployments"**
2. Cliquer sur **"Redeploy"**
3. Cliquer sur **"Redeploy"** (confirmation)

---

## Étape 9 : Tester ! 🎉

1. Ouvrir le lien de votre site (ex: `https://le-leon-xxxxx.vercel.app`)
2. Créer une partie
3. Noter le code (ex: `ABC123`)
4. Ouvrir un autre navigateur/onglet incognito
5. Rejoindre avec le code
6. Jouer !

---

## Vérifications en cas de problème 🔍

### Le site se charge mais les parties ne fonctionnent pas

✅ **Vérifier** : Les bases de données sont bien créées
1. Aller dans **"Storage"**
2. Vous devez voir **2 bases** : KV et Postgres

✅ **Vérifier** : Les variables d'environnement
1. Aller dans **"Settings"** → **"Environment Variables"**
2. Vous devez voir : `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `POSTGRES_URL`, etc.

✅ **Vérifier** : Les migrations ont été exécutées
```bash
vercel env pull .env
npm run db:migrate
```

### Erreur "Database connection failed"

➡️ Redéployer après avoir créé les bases de données :
```bash
vercel --prod
```

### Le site affiche une erreur 500

1. Sur Vercel, aller dans **"Deployments"**
2. Cliquer sur votre dernier déploiement
3. Aller dans **"Functions"** → **"Logs"**
4. Chercher les erreurs en rouge

---

## Mise à jour du code 🔄

Quand vous modifiez le code :

```bash
git add .
git commit -m "Description de vos modifications"
git push
```

➡️ Vercel déploie automatiquement les changements !

---

## Personnalisation 🎨

### Changer le nom de domaine

1. Sur Vercel, aller dans **"Settings"** → **"Domains"**
2. Ajouter votre domaine personnalisé (optionnel, payant)

### Changer les couleurs

Modifier `tailwind.config.ts` :
```typescript
colors: {
  'leon-green': '#1a5f3f',  // Vert du tapis
  'leon-red': '#c41e3a',    // Rouge des cartes
  'leon-gold': '#ffd700',   // Or du Léon
}
```

---

## Coûts 💰

### Vercel Free Tier (gratuit à vie)

✅ **KV** : 256 MB, 100 000 commandes/mois
✅ **Postgres** : 256 MB, 60h compute/mois
✅ **Bandwidth** : 100 GB/mois
✅ **Functions** : 100 GB-hours

➡️ **Largement suffisant** pour des centaines de parties en famille !

### Si vous dépassez (très peu probable)

Vercel vous enverra un email. Vous pourrez :
- Passer au plan Pro ($20/mois)
- Ou simplement attendre le mois suivant (les limites se réinitialisent)

---

## Support 💬

### Problèmes courants

**Q : Les joueurs ne se synchronisent pas**
R : Vérifier que Vercel KV est bien créé et connecté

**Q : Les scores ne s'enregistrent pas**
R : Exécuter les migrations SQL

**Q : Le site est lent**
R : Vérifier la région des bases de données (choisir la plus proche)

### Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

**Félicitations ! Votre jeu Le Léon est maintenant en ligne ! 🎴✨**

Partagez le lien avec votre famille et bon jeu !

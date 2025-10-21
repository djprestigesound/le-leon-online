# Démarrage Rapide ⚡

## En 5 minutes chrono !

### 1️⃣ Installer les dépendances

```bash
cd ~/le-leon-online
npm install
```

### 2️⃣ Lancer en local

```bash
npm run dev
```

Ouvrir → http://localhost:3000

⚠️ **Note** : En local, pas de persistence (pas de BDD). Pour tester vraiment, déployer sur Vercel.

---

## Déploiement sur Vercel (gratuit)

### Option Express (GitHub + Vercel)

1. **Créer un repo GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE_USERNAME/le-leon-online.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - "New Project" → Importer votre repo
   - Deploy (ne rien changer)

3. **Créer les bases de données**
   - Storage → Create Database → **KV**
   - Storage → Create Database → **Postgres**

4. **Migrer la BDD**
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   vercel env pull .env
   npm run db:migrate
   vercel --prod
   ```

5. **C'est en ligne !** 🎉

---

## Tester le jeu

1. Ouvrir votre URL Vercel
2. Créer une partie
3. Noter le code (ex: ABC123)
4. Ouvrir un onglet incognito
5. Rejoindre avec le code
6. Jouer !

---

## Problèmes ?

**Le jeu ne se synchronise pas**
→ Vérifier que KV est créé dans Storage

**Erreur 500**
→ Vérifier que Postgres est créé + migrations exécutées

**Plus de détails** → Voir DEPLOIEMENT.md

---

Bon jeu ! 🎴

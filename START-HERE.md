# 🎴 COMMENCER ICI - Le Léon

## ✅ Tout est prêt ! Il ne reste que 3 étapes :

---

## Étape 1 : Push sur GitHub (1 minute)

**Option facile - Via GitHub Desktop :**
1. Télécharge [GitHub Desktop](https://desktop.github.com)
2. Ouvre GitHub Desktop
3. File → Add Local Repository
4. Choisis le dossier : `/Users/quentinsteffen/le-leon-online`
5. Clique "Publish repository"
6. Choisis "Public" ou "Private"
7. Clique "Publish"

**Option terminal :**
```bash
# Sur GitHub.com, crée un nouveau repo "le-leon-online"
# Puis dans le terminal :

cd ~/le-leon-online
git remote add origin https://github.com/TON_USERNAME/le-leon-online.git
git push -u origin main
```

---

## Étape 2 : Déployer sur Vercel (2 minutes)

```bash
cd ~/le-leon-online
./DEPLOY.sh
```

Ce script va :
- ✅ Installer Vercel CLI
- ✅ Te connecter à Vercel (une page s'ouvre, clique "Confirm")
- ✅ Déployer ton site

**Copie l'URL** qui s'affiche à la fin (ex: `https://le-leon-xxxxx.vercel.app`)

---

## Étape 3 : Configurer les bases de données (3 minutes)

### 3a. Créer les databases

1. Va sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique sur ton projet **"le-leon-online"**
3. Onglet **"Storage"** → **"Create Database"**
4. Choisis **"KV"** → Nom : `le-leon-kv` → **Create**
5. Encore **"Create Database"** → **"Postgres"** → Nom : `le-leon-postgres` → **Create**

### 3b. Migrer la base

```bash
cd ~/le-leon-online
./SETUP-DB.sh
```

---

## 🎉 C'EST FINI !

Ton jeu est maintenant en ligne ! Ouvre l'URL de ton site et teste :

1. Crée une partie
2. Note le code (ex: ABC123)
3. Ouvre un onglet incognito
4. Rejoins avec le code
5. Joue ! 🎴

---

## ❓ En cas de problème

**Le script DEPLOY.sh ne marche pas**
```bash
# Lance manuellement :
npm install -g vercel
vercel login
vercel --prod
```

**Le site affiche une erreur**
→ Vérifie que tu as bien créé KV et Postgres dans l'étape 3a

**Autre problème**
→ Ouvre le fichier `DEPLOIEMENT.md` pour le guide détaillé

---

**Bon déploiement ! 🚀**

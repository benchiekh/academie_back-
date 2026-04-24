# 🚀 Guide de Déploiement Gratuit - Académie Backend

## 📋 Prérequis

1. **Compte GitHub** avec votre projet uploadé
2. **Variables d'environnement** configurées
3. **Base de données PostgreSQL** (fournie par la plateforme)

## 🎯 Options de Déploiement Gratuit

### 1️⃣ Render.com (Recommandé)

#### Étapes :
1. Créez un compte sur [render.com](https://render.com)
2. Connectez votre compte GitHub
3. Créez un **New Web Service**
4. Connectez votre repository GitHub
5. Configurez :
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start:prod`
   - **Runtime** : `Node 18`
6. Ajoutez une base de données PostgreSQL gratuite
7. Configurez les variables d'environnement :
   ```
   DATABASE_URL = (fourni par Render)
   JWT_SECRET = votre-secret-jwt-unique
   NODE_ENV = production
   ```

#### Avantages :
- ✅ 750 heures/mois gratuites
- ✅ PostgreSQL inclus
- ✅ Déploiement automatique
- ✅ HTTPS automatique

---

### 2️⃣ Railway.app

#### Étapes :
1. Créez un compte sur [railway.app](https://railway.app)
2. Connectez votre projet GitHub
3. Ajoutez une base de données PostgreSQL
4. Configurez les variables d'environnement
5. Déployez automatiquement

#### Avantages :
- ✅ $5 crédit/mois (suffisant pour usage perso)
- ✅ Très simple à utiliser
- ✅ Base de données gratuite

---

### 3️⃣ Vercel

#### Étapes :
1. Installez Vercel CLI : `npm i -g vercel`
2. Connectez votre compte : `vercel login`
3. Déployez : `vercel --prod`
4. Configurez la base de données via Vercel Postgres

#### Avantages :
- ✅ Serverless functions
- ✅ Performance excellente
- ✅ CDN mondial

---

## 🔧 Variables d'Environnement

### Obligatoires :
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=votre-secret-j tres-long-et-unique
NODE_ENV=production
PORT=3000
```

### Optionnelles :
```
FRONTEND_URL=https://votre-frontend.com
```

## 📝 Fichiers de Configuration Créés

- ✅ `Dockerfile` : Pour déploiement conteneurisé
- ✅ `render.yaml` : Configuration Render.com
- ✅ `vercel.json` : Configuration Vercel
- ✅ `.dockerignore` : Exclusions Docker
- ✅ `.env.example` : Modèle d'environnement

## 🚀 Test de Déploiement

Une fois déployé, testez avec :
```bash
curl https://votre-backend-url.onrender.com/
```

## 🔍 Monitoring

- **Render.com** : Logs dans le dashboard
- **Railway.app** : Logs en temps réel
- **Vercel** : Functions logs

## 💡 Conseils Pro

1. **JWT Secret** : Utilisez un secret long et unique
2. **Database** : Sauvegardez votre base de données
3. **HTTPS** : Toutes les plateformes fournissent HTTPS
4. **CORS** : Déjà configuré pour toutes les origines
5. **Scaling** : Commencez avec le plan gratuit, upgradez si besoin

## 🆘 Support

- **Render** : support@render.com
- **Railway** : support@railway.app
- **Vercel** : support@vercel.com

---

**Votre backend NestJS est prêt pour le déploiement gratuit 100% !** 🎉

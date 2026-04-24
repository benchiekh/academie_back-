# 🚀 Guide Déploiement Backend NestJS sur Render.com avec Supabase

## 📋 ÉTAPE 1 : Préparation Supabase

1. **Connectez-vous à Supabase** : https://supabase.com
2. **Allez dans votre projet**
3. **Settings → Database**
4. **Copiez la Connection string** :
   ```
   postgresql://postgres:[VOTRE_MDP]@db.xxxx.supabase.co:5432/postgres
   ```

---

## 📋 ÉTAPE 2 : Préparation GitHub

1. **Poussez votre code sur GitHub** :
```bash
git add .
git commit -m "Ready for Render deployment with Supabase"
git push origin main
```

---

## 📋 ÉTAPE 3 : Création Compte Render.com

1. **Allez sur** : https://render.com
2. **Sign up with GitHub** (recommandé)
3. **Vérifiez votre email**
4. **Autorisez Render à accéder à vos repos GitHub**

---

## 📋 ÉTAPE 4 : Création Web Service

1. **Dashboard → New Web Service**
2. **Connectez votre repository GitHub**
3. **Configurez le service** :

### 📝 Configuration :
- **Name** : `academie-backend`
- **Environment** : `Node`
- **Plan** : `Free`
- **Build Command** : `npm install && npm run build && npx prisma generate`
- **Start Command** : `npm run start:prod`

---

## 📋 ÉTAPE 5 : Variables d'Environnement

Ajoutez ces variables dans **Environment Variables** :

```
NODE_ENV = production
PORT = 3000
DATABASE_URL = postgresql://postgres:[VOTRE_MDP]@db.xxxx.supabase.co:5432/postgres
JWT_SECRET = votre-secret-jwt-tres-long-et-unique-pour-production
```

**IMPORTANT** : Remplacez `[VOTRE_MDP]` et `xxxx` avec vos vraies valeurs Supabase !

---

## 📋 ÉTAPE 6 : Déploiement

1. **Cliquez sur "Create Web Service"**
2. **Attendez le build** (2-3 minutes)
3. **Vérifiez les logs** pour voir si tout fonctionne

---

## 📋 ÉTAPE 7 : Test de l'API

Une fois déployé, votre URL sera :
```
https://academie-backend.onrender.com
```

**Testez avec curl :**
```bash
curl https://academie-backend.onrender.com/
```

---

## 🔧 Configuration Supabase (si besoin)

### Pooling de connexion (recommandé) :
```
DATABASE_URL = postgresql://postgres.[PROJECT_REF]:[VOTRE_MDP]@aws-0-xxx.pooler.supabase.com:6543/postgres
```

### SSL Mode :
```
DATABASE_URL = postgresql://postgres:[VOTRE_MDP]@db.xxxx.supabase.co:5432/postgres?sslmode=require
```

---

## 🚨 Dépannage

### Si le build échoue :
1. **Vérifiez les logs** dans Render
2. **Assurez-vous que package.json est correct**
3. **Vérifiez les variables d'environnement**

### Si la connexion DB échoue :
1. **Testez l'URL Supabase localement**
2. **Vérifiez que Prisma est bien généré**
3. **Assurez-vous que les tables existent**

### Si CORS bloque :
1. **Ajoutez l'URL de votre frontend dans les CORS**
2. **Vérifiez que votre frontend est aussi déployé**

---

## 📊 Monitoring

- **Logs** : Disponible dans le dashboard Render
- **Metrics** : Utilisation CPU, mémoire
- **Health Check** : Route `/` configurée

---

## 💡 Astuces Pro

1. **Secret JWT** : Utilisez un générateur de password
2. **Database** : Utilisez le connection pooling pour la performance
3. **Build** : Le build est automatique à chaque push sur GitHub
4. **Scaling** : Upgradez le plan si besoin de plus de ressources

---

## 🎉 Résultat Final

Votre backend sera accessible à :
```
https://academie-backend.onrender.com
```

Avec votre base de données Supabase connectée ! 🚀

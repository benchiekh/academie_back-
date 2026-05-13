# 🚀 Configuration Supabase pour la persistance des données

## 📋 Problème actuel
Les données sont perdues au redémarrage du serveur car le backend utilise la base en mémoire (fallback).

## 🔧 Solution rapide

### 1. Créez le fichier `.env`
```bash
# Dans le dossier backend
cp .env.example .env
```

### 2. Ajoutez vos clés Supabase
Éditez le fichier `.env` et ajoutez :
```bash
SUPABASE_URL="https://votre-projet-id.supabase.co"
SUPABASE_ANON_KEY="votre-cle-anon-ici"
```

### 3. Où trouver vos clés Supabase
1. Allez dans votre dashboard Supabase
2. **Project Settings** ⚙️
3. **API** section
4. Copiez :
   - **Project URL** → pour `SUPABASE_URL`
   - **anon public** key → pour `SUPABASE_ANON_KEY`

### 4. Redémarrez le backend
```bash
npm run start:dev
```

Vous devriez voir :
```
🗄️  Connexion à Supabase établie
```

## ✅ Résultat
- **Avec Supabase** : Les données persistent même après redémarrage
- **Sans Supabase** : Le fallback en mémoire fonctionne mais perd les données
- **Basculage automatique** : Le backend détecte et utilise Supabase si configuré

## 🎯 Étapes suivantes
1. Copiez `.env.example` vers `.env`
2. Ajoutez vos vraies clés Supabase
3. Redémarrez le backend
4. Testez la persistance des données

**Une fois configuré, plus de perte de données !** 🚀

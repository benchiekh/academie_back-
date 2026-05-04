const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Fichier de persistance des données
const DATA_FILE = path.join(__dirname, 'data.json');

// Fonction pour charger les données depuis le fichier
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.parents || [];
    }
  } catch (error) {
    console.log('Erreur lors du chargement des données:', error);
  }
  
  // Données par défaut si le fichier n'existe pas
  return [
    {
      id: 1,
      name: 'Parent Test 1',
      email: 'parent1@test.com',
      role: 'PARENT',
      createdAt: '2026-04-27T10:00:00.000Z'
    },
    {
      id: 2,
      name: 'Parent Test 2',
      email: 'parent2@test.com',
      role: 'PARENT',
      createdAt: '2026-04-27T11:00:00.000Z'
    }
  ];
}

// Fonction pour sauvegarder les données dans le fichier
function saveData() {
  try {
    const data = {
      parents: parents,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Données sauvegardées avec succès');
  } catch (error) {
    console.log('Erreur lors de la sauvegarde des données:', error);
  }
}

// Charger les données au démarrage
let parents = loadData();
console.log(`Chargé ${parents.length} parents depuis le fichier`);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes simples
app.get('/', (req, res) => {
  res.json({ 
    message: 'Académie Backend API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // Validation de l'email
  if (!email.includes('@') || email.length < 5) {
    return res.status(400).json({ error: 'Email invalide' });
  }
  
  // Validation du mot de passe
  if (password.length < 3) {
    return res.status(400).json({ error: 'Mot de passe trop court (minimum 3 caractères)' });
  }
  
  // Logique de rôle selon l'email
  let role = 'PARENT'; // Par défaut
  if (email === 'admin@academie.com') {
    role = 'ADMIN';
  }
  
  // Vérifier si l'utilisateur existe dans notre base de données
  let user = null;
  if (role === 'ADMIN') {
    // Vérifier le mot de passe admin
    if (password !== 'admin123') {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    user = {
      email: 'admin@academie.com',
      name: 'Administrateur',
      role: 'ADMIN'
    };
  } else {
    // Chercher dans la base des parents
    user = parents.find(p => p.email === email);
    if (user) {
      // Vérifier le mot de passe du parent
      // Pour simplifier, on accepte soit 'parent123' soit le mot de passe utilisé lors de la création
      // Si le mot de passe est stocké dans l'objet parent, on le vérifie
      if (user.password && password !== user.password) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }
      // Si aucun mot de passe n'est stocké, on accepte 'parent123' par défaut
      if (!user.password && password !== 'parent123') {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }
      user = { ...user }; // Copier l'utilisateur trouvé
    } else {
      // Si le parent n'existe pas, refuser la connexion
      return res.status(401).json({ error: 'Aucun compte trouvé avec cet email' });
    }
  }
  
  if (user) {
    res.json({
      message: 'Login successful',
      user: user,
      token: 'simple-token-for-testing'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Endpoint de création de compte parent
app.post('/auth/create-parent', (req, res) => {
  const { name, email, password, role } = req.body;
  
  console.log('📝 Création compte parent:', { name, email, role });
  
  // Validation simple
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Name, email and password are required' 
    });
  }
  
  // Vérifier si l'email existe déjà
  const existingParent = parents.find(p => p.email === email);
  if (existingParent) {
    return res.status(400).json({ 
      error: 'Email already exists' 
    });
  }
  
  // Créer le nouveau parent
  const newParent = {
    id: Date.now(),
    name,
    email,
    password: password, // Stocker le mot de passe pour la connexion
    role: role || 'PARENT',
    createdAt: new Date().toISOString()
  };
  
  // Ajouter à la base de données en mémoire
  parents.push(newParent);
  
  // Sauvegarder les données dans le fichier
  saveData();
  
  console.log('✅ Compte parent créé:', newParent);
  console.log('📊 Total parents:', parents.length);
  
  res.json({
    message: 'Parent account created successfully',
    parent: newParent
  });
});

// Endpoint pour récupérer tous les parents
app.get('/auth/parents', (req, res) => {
  console.log('📋 Récupération des parents');
  console.log('📊 Total parents dans la base:', parents.length);
  console.log('📋 Contenu de la base:', parents);
  
  res.json({
    message: 'Parents retrieved successfully',
    parents: parents
  });
});

// Endpoint pour mettre à jour un parent
app.put('/auth/parents/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  console.log('✏️ Mise à jour parent:', { id, name, email });
  
  // Simulation de mise à jour
  const updatedParent = {
    id: parseInt(id),
    name: name || 'Updated Name',
    email: email || 'updated@test.com',
    role: 'PARENT',
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'Parent updated successfully',
    parent: updatedParent
  });
});

// Endpoint pour supprimer un parent
app.delete('/auth/parents/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('🗑️ Suppression parent:', { id });
  
  res.json({
    message: 'Parent deleted successfully',
    deletedId: parseInt(id)
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Simple Express server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
});

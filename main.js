const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Simulation de base de données en mémoire
let parents = [
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
  
  // Pour l'instant, réponse simple (à remplacer avec votre vraie logique)
  if (email && password) {
    res.json({
      message: 'Login endpoint working',
      user: { email, role: 'ADMIN' },
      token: 'simple-token-for-testing'
    });
  } else {
    res.status(400).json({ error: 'Email and password required' });
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
    role: role || 'PARENT',
    createdAt: new Date().toISOString()
  };
  
  // Ajouter à la base de données en mémoire
  parents.push(newParent);
  
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

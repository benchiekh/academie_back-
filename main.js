const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;
let useSupabase = false;

// Vérifier si Supabase est configuré
console.log('🔍 Vérification configuration Supabase...');
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey ? 'configured' : 'missing');
console.log('🔍 URL placeholder check:', supabaseUrl !== 'https://your-project.supabase.co');

if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    useSupabase = true;
    console.log('🗄️  Connexion à Supabase établie');
  } catch (error) {
    console.error('❌ Erreur connexion Supabase:', error.message);
    useSupabase = false;
  }
} else {
  console.log('⚠️  Supabase non configuré - utilisation de la base de données en mémoire');
  
  // En production, échouer si Supabase n'est pas configuré
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERREUR CRITIQUE: Supabase doit être configuré en production!');
    console.error('❌ Veuillez vérifier les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY');
    process.exit(1);
  }
}

// Base de données en mémoire comme fallback (vide pour forcer Supabase)
let parents = [];

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
app.post('/auth/login', async (req, res) => {
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
    // Chercher dans la base de données
    if (useSupabase) {
      try {
        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .eq('email', email)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // Aucun parent trouvé
            return res.status(401).json({ error: 'Aucun compte trouvé avec cet email' });
          }
          console.error('❌ Erreur recherche parent Supabase:', error);
          return res.status(500).json({ error: 'Erreur serveur' });
        }
        
        if (user) {
          // Vérifier le mot de passe du parent
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
      } catch (error) {
        console.error('❌ Erreur connexion Supabase:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
    } else {
      // Fallback: utiliser la base de données en mémoire
      user = parents.find(p => p.email === email);
      if (user) {
        // Vérifier le mot de passe du parent
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

// Endpoint pour créer un compte parent
app.post('/auth/create-parent', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  console.log('📝 Création compte parent:', { name, email, role });
  
  // Validation des données
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Name, email and password are required' 
    });
  }
  
  // Validation de l'email
  if (!email.includes('@') || email.length < 5) {
    return res.status(400).json({ 
      error: 'Email invalide' 
    });
  }
  
  // Validation du mot de passe
  if (password.length < 3) {
    return res.status(400).json({ 
      error: 'Mot de passe trop court (minimum 3 caractères)' 
    });
  }
  
  if (useSupabase) {
    try {
      // Vérifier si l'email existe déjà dans Supabase
      const { data: existingParent, error: checkError } = await supabase
        .from('User')
        .select('*')
        .eq('email', email)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Erreur vérification email Supabase:', checkError);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      
      if (existingParent) {
        return res.status(400).json({ 
          error: 'Email already exists' 
        });
      }
      
      // Créer le nouvel utilisateur dans Supabase
      const { data: newParent, error: insertError } = await supabase
        .from('User')
        .insert([{
          name,
          email,
          password: password, // En production, il faudrait hasher ce mot de passe
          role: role || 'PARENT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Erreur création parent Supabase:', insertError);
        return res.status(500).json({ error: 'Erreur lors de la création du compte' });
      }
      
      console.log('✅ Compte parent créé dans Supabase:', newParent);
      
      res.json({
        message: 'Parent account created successfully',
        parent: newParent
      });
      
    } catch (error) {
      console.error('❌ Erreur serveur Supabase:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    // Fallback: utiliser la base de données en mémoire
    const existingParent = parents.find(p => p.email === email);
    if (existingParent) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }
    
    const newParent = {
      id: Date.now(),
      name,
      email,
      password: password,
      role: role || 'PARENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    parents.push(newParent);
    
    console.log('✅ Compte parent créé dans la base en mémoire:', newParent);
    console.log('📊 Total parents dans la base en mémoire:', parents.length);
    
    res.json({
      message: 'Parent account created successfully',
      parent: newParent
    });
  }
});

// Endpoint pour récupérer tous les parents
app.get('/auth/parents', async (req, res) => {
  console.log('📋 Récupération des parents');
  
  if (useSupabase) {
    try {
      const { data: parents, error } = await supabase
        .from('User')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('❌ Erreur récupération parents Supabase:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des parents' });
      }
      
      console.log(`📊 ${parents.length} parents récupérés depuis Supabase`);
      
      res.json({
        message: 'Parents retrieved successfully',
        parents: parents
      });
      
    } catch (error) {
      console.error('❌ Erreur serveur Supabase:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    // Fallback: utiliser la base de données en mémoire
    console.log(`📊 ${parents.length} parents récupérés depuis la base en mémoire`);
    
    res.json({
      message: 'Parents retrieved successfully',
      parents: parents
    });
  }
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

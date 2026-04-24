const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

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

// Auth route simple
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Pour l'instant, réponse simple (à remplacer avec votre logique)
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Simple Express server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
});

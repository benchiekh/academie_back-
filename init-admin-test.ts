import axios from 'axios';

async function initAdmin() {
  try {
    console.log('Initialisation du compte admin...');
    
    const response = await axios.post('http://localhost:3000/auth/init-admin');
    
    console.log('Réponse:', response.data);
    
  } catch (error: any) {
    console.error('Erreur:', error.response?.data || error.message);
  }
}

initAdmin();

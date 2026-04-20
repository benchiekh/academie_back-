import axios from 'axios';

async function testLogin() {
  try {
    console.log('Test de connexion avec le compte admin...');
    
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@academie.com',
      password: 'admin123'
    });

    console.log('Réponse complète:', JSON.stringify(response.data, null, 2));
    console.log('Token:', response.data.access_token);
    console.log('Utilisateur:', response.data.user);
    
  } catch (error: any) {
    console.error('Erreur de connexion:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testLogin();

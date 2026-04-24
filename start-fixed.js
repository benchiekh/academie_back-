// Fichier de démarrage alternatif pour Render
const path = require('path');

console.log('🔍 Starting application with path checks...');

// Vérifier si dist/main.js existe
const mainPath = path.join(__dirname, 'dist', 'main.js');
console.log(`📁 Looking for main.js at: ${mainPath}`);

try {
  require('fs').accessSync(mainPath);
  console.log('✅ main.js found, starting application...');
  
  // Démarrer l'application
  require('./dist/main');
} catch (error) {
  console.error('❌ main.js not found, checking dist folder...');
  
  try {
    const files = require('fs').readdirSync(path.join(__dirname, 'dist'));
    console.log('📂 Files in dist folder:', files);
    
    // Chercher un fichier main alternatif
    const mainFiles = files.filter(f => f.includes('main'));
    if (mainFiles.length > 0) {
      console.log(`🔄 Trying alternative main file: ${mainFiles[0]}`);
      require(`./dist/${mainFiles[0]}`);
    } else {
      console.error('❌ No main file found in dist folder');
      process.exit(1);
    }
  } catch (dirError) {
    console.error('❌ dist folder not found or empty');
    console.error('📁 Current directory contents:', require('fs').readdirSync(__dirname));
    process.exit(1);
  }
}

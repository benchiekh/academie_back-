import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/auth/auth.service';

async function createAdminAfterTables() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  
  try {
    console.log('Création du compte administrateur...');
    const admin = await authService.createAdmin();
    console.log('✅ Compte administrateur créé avec succès:');
    console.log('Email:', admin.email);
    console.log('Mot de passe: admin123');
    console.log('Nom:', admin.name);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Le compte administrateur existe déjà');
    } else {
      console.error('❌ Erreur lors de la création du compte admin:', error.message);
    }
  } finally {
    await app.close();
  }
}

createAdminAfterTables();

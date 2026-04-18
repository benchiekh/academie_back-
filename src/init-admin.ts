import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  
  try {
    const admin = await authService.createAdmin();
    console.log('Compte administrateur créé avec succès:');
    console.log('Email:', admin.email);
    console.log('Mot de passe: admin123');
    console.log('Nom:', admin.name);
  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

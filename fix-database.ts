import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function fixDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Configuration automatique de la base de données...');
    
    // Créer le type Role
    try {
      await prisma.$executeRawUnsafe(`CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARENT')`);
      console.log('✅ Type Role créé');
    } catch (error: any) {
      if (error.code === '42710') {
        console.log('ℹ️ Type Role existe déjà');
      } else {
        console.log('Erreur type:', error.message);
      }
    }
    
    // Créer la table User
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE "User" (
            "id" SERIAL NOT NULL,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "role" "Role" NOT NULL DEFAULT 'PARENT',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        )
      `);
      console.log('✅ Table User créée');
    } catch (error: any) {
      if (error.code === '42P07') {
        console.log('ℹ️ Table User existe déjà');
      } else {
        console.log('Erreur table:', error.message);
      }
    }
    
    // Créer l'index unique sur email
    try {
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`);
      console.log('✅ Index email créé');
    } catch (error: any) {
      if (error.code === '42P07') {
        console.log('ℹ️ Index email existe déjà');
      } else {
        console.log('Erreur index:', error.message);
      }
    }
    
    // Créer le compte admin
    try {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.$executeRawUnsafe(`
        INSERT INTO "User" ("name", "email", "password", "role", "createdAt", "updatedAt")
        VALUES ('Administrateur', 'admin@academie.com', '${hashedPassword}', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("email") DO NOTHING
      `);
      
      console.log('✅ Compte administrateur créé');
      console.log('📧 Email: admin@academie.com');
      console.log('🔑 Mot de passe: admin123');
    } catch (error: any) {
      console.log('Erreur création admin:', error.message);
    }
    
    console.log('🎉 Base de données configurée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase();

import { PrismaClient } from '@prisma/client';

async function setupDatabase() {
  try {
    console.log('Création des tables dans la base de données...');
    
    // Création du type Role
    const prisma1 = new PrismaClient();
    try {
      await prisma1.$executeRaw`CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARENT');`;
      console.log('✅ Type Role créé');
    } catch (error: any) {
      if (error.code === '42710') {
        console.log('ℹ️ Type Role existe déjà');
      } else {
        console.log('Erreur création type:', error.message);
      }
    } finally {
      await prisma1.$disconnect();
    }
    
    // Création de la table User
    const prisma2 = new PrismaClient();
    try {
      await prisma2.$executeRaw`
        CREATE TABLE "User" (
            "id" SERIAL NOT NULL,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "role" "Role" NOT NULL DEFAULT 'PARENT',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
      `;
      console.log('✅ Table User créée');
    } catch (error: any) {
      if (error.code === '42P07') {
        console.log('ℹ️ Table User existe déjà');
      } else {
        console.log('Erreur création table:', error.message);
      }
    } finally {
      await prisma2.$disconnect();
    }
    
    // Création de l'index
    const prisma3 = new PrismaClient();
    try {
      await prisma3.$executeRaw`CREATE UNIQUE INDEX "User_email_key" ON "User"("email");`;
      console.log('✅ Index email créé');
    } catch (error: any) {
      if (error.code === '42P07') {
        console.log('ℹ️ Index email existe déjà');
      } else {
        console.log('Erreur création index:', error.message);
      }
    } finally {
      await prisma3.$disconnect();
    }
    
    console.log('✅ Base de données configurée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  }
}

setupDatabase();

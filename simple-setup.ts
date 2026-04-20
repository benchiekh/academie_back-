import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function simpleSetup() {
  try {
    console.log('Test de connexion à la base de données...');
    
    // Vérifier si la table existe
    try {
      const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "User"`;
      console.log('✅ Table User existe déjà');
    } catch (error: any) {
      console.log('❌ Table User n\'existe pas:', error.message);
      console.log('Veuillez créer manuellement la table User dans Supabase avec le SQL suivant:');
      console.log(`
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARENT');

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

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
      `);
      return;
    }
    
    // Créer le compte admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    try {
      const admin = await prisma.user.create({
        data: {
          name: 'Administrateur',
          email: 'admin@academie.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      }) as any;
      
      console.log('✅ Compte administrateur créé avec succès:');
      console.log('Email:', admin.email);
      console.log('Mot de passe: admin123');
      console.log('Nom:', admin.name);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log('ℹ️ Le compte administrateur existe déjà');
      } else {
        console.log('❌ Erreur création admin:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleSetup();

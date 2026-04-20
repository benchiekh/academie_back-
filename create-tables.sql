-- Création de l'énumération pour les rôles
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARENT');

-- Création de la table User
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

-- Création de l'index unique sur l'email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

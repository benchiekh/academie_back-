import { PrismaClient } from '@prisma/client';

async function checkAdmin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Vérification du compte admin...');
    
    const users = await prisma.$queryRawUnsafe(`
      SELECT id, name, email, role, "createdAt"
      FROM "User" 
      WHERE email = 'admin@academie.com'
      LIMIT 1
    `) as any[];

    if (users.length > 0) {
      console.log('Compte admin trouvé:', users[0]);
    } else {
      console.log('Aucun compte admin trouvé');
      
      // Créer le compte admin manuellement
      console.log('Création du compte admin...');
      const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // admin123
      
      const admins = await prisma.$queryRawUnsafe(`
        INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ('Administrateur', 'admin@academie.com', '${hashedPassword}', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name, email, role, "createdAt"
      `) as any[];
      
      console.log('Compte admin créé:', admins[0]);
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();

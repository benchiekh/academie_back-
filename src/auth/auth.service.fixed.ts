import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthServiceFixed {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private getNewPrismaClient(): PrismaClient {
    return new PrismaClient();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const prisma = this.getNewPrismaClient();
    try {
      const users = await prisma.$queryRawUnsafe(`
        SELECT id, name, email, password, role, "createdAt", "updatedAt" 
        FROM "User" 
        WHERE email = '${email.replace(/'/g, "''")}'
        LIMIT 1
      `) as any[];

      const user = users[0];
      
      if (user && user.password && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Erreur validateUser:', error);
      return null;
    } finally {
      await prisma.$disconnect();
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async createAdmin() {
    const prisma = this.getNewPrismaClient();
    try {
      // Vérifier si un admin existe déjà
      const existingAdmins = await prisma.$queryRawUnsafe(`
        SELECT id, name, email, role, "createdAt", "updatedAt"
        FROM "User" 
        WHERE role = 'ADMIN'
        LIMIT 1
      `) as any[];

      if (existingAdmins.length > 0) {
        return existingAdmins[0];
      }

      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Créer l'admin
      const admins = await prisma.$queryRawUnsafe(`
        INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ('Administrateur', 'admin@academie.com', '${hashedPassword}', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name, email, role, "createdAt", "updatedAt"
      `) as any[];

      return admins[0];
    } catch (error) {
      console.error('Erreur createAdmin:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async createParent(parentData: { name: string; email: string; password: string }) {
    const prisma = this.getNewPrismaClient();
    try {
      const hashedPassword = await bcrypt.hash(parentData.password, 10);
      
      const parents = await prisma.$queryRawUnsafe(`
        INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ('${parentData.name.replace(/'/g, "''")}', '${parentData.email.replace(/'/g, "''")}', '${hashedPassword}', 'PARENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name, email, role, "createdAt", "updatedAt"
      `) as any[];

      return parents[0];
    } catch (error) {
      console.error('Erreur createParent:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getParents() {
    const prisma = this.getNewPrismaClient();
    try {
      const parents = await prisma.$queryRawUnsafe(`
        SELECT id, name, email, "createdAt"
        FROM "User" 
        WHERE role = 'PARENT'
        ORDER BY "createdAt" DESC
      `) as any[];

      return parents;
    } catch (error) {
      console.error('Erreur getParents:', error);
      return [];
    } finally {
      await prisma.$disconnect();
    }
  }
}

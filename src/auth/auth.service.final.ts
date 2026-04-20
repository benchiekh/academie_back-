import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';

@Injectable()
export class AuthService {
  private pool: Pool;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    // Créer un pool de connexion PostgreSQL direct
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT id, name, email, password, role, "createdAt", "updatedAt" 
        FROM "User" 
        WHERE email = $1
        LIMIT 1
      `, [email]);

      const user = result.rows[0];
      
      if (user && user.password && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Erreur validateUser:', error);
      return null;
    } finally {
      client.release();
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
    const client = await this.pool.connect();
    try {
      // Vérifier si un admin existe déjà
      const existingResult = await client.query(`
        SELECT id, name, email, role, "createdAt", "updatedAt"
        FROM "User" 
        WHERE role = 'ADMIN'
        LIMIT 1
      `);

      if (existingResult.rows.length > 0) {
        return existingResult.rows[0];
      }

      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Créer l'admin
      const result = await client.query(`
        INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name, email, role, "createdAt", "updatedAt"
      `, ['Administrateur', 'admin@academie.com', hashedPassword, 'ADMIN']);

      return result.rows[0];
    } catch (error) {
      console.error('Erreur createAdmin:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createParent(parentData: { name: string; email: string; password: string }) {
    const client = await this.pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(parentData.password, 10);
      
      const result = await client.query(`
        INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name, email, role, "createdAt", "updatedAt"
      `, [parentData.name, parentData.email, hashedPassword, 'PARENT']);

      return result.rows[0];
    } catch (error) {
      console.error('Erreur createParent:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getParents() {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT id, name, email, "createdAt"
        FROM "User" 
        WHERE role = 'PARENT'
        ORDER BY "createdAt" DESC
      `);

      return result.rows;
    } catch (error) {
      console.error('Erreur getParents:', error);
      return [];
    } finally {
      client.release();
    }
  }
}

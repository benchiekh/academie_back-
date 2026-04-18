import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    }) as any;

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
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
    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      const { password, ...result } = existingAdmin as any;
      return result;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await this.prisma.user.create({
      data: {
        name: 'Administrateur',
        email: 'admin@academie.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    }) as any;

    const { password, ...result } = admin;
    return result;
  }

  async createParent(parentData: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(parentData.password, 10);
    
    const parent = await this.prisma.user.create({
      data: {
        name: parentData.name,
        email: parentData.email,
        password: hashedPassword,
        role: 'PARENT',
      },
    }) as any;

    const { password, ...result } = parent;
    return result;
  }

  async getParents() {
    return this.prisma.user.findMany({
      where: { role: 'PARENT' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }
}

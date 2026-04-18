import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      return { message: 'Identifiants invalides' };
    }
    
    return this.authService.login(user);
  }

  @Post('init-admin')
  async createAdmin() {
    const admin = await this.authService.createAdmin();
    return {
      message: 'Compte administrateur créé avec succès',
      admin: {
        email: admin.email,
        password: 'admin123',
      },
    };
  }

  @Post('create-parent')
  @UseGuards(JwtAuthGuard)
  async createParent(@Body() parentData: { name: string; email: string; password: string }) {
    const parent = await this.authService.createParent(parentData);
    return {
      message: 'Compte parent créé avec succès',
      parent,
    };
  }

  @Get('parents')
  @UseGuards(JwtAuthGuard)
  async getParents() {
    return this.authService.getParents();
  }
}

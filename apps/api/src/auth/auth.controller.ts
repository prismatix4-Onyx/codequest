import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('guest')
  async createGuest() {
    return this.authService.createGuestSession();
  }

  @Post('google')
  async googleLogin(@Body() body: { email: string; name: string; avatarUrl?: string }) {
    return this.authService.googleAuth(body.email, body.name, body.avatarUrl);
  }

  @Post('register')
  async register(@Body() body: { email: string; username: string; password: string }) {
    return this.authService.register(body.email, body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      return this.authService.getProfile(decoded.sub);
    } catch {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }
}

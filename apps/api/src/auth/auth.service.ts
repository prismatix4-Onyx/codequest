import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { UserProfile, UserRole } from '@codequest/shared-types';

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

@Injectable()
export class AuthService {
  // In-memory fallback user store when database container is starting up or in standalone test
  private mockUsers: Map<string, any> = new Map();

  constructor(private readonly jwtService: JwtService) {
    // Seed default guest user
    this.mockUsers.set('guest-user', {
      id: 'guest-user',
      email: 'guest@codequest.dev',
      username: 'Cadet_Explorer',
      passwordHash: '',
      role: 'PLAYER' as UserRole,
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async createGuestSession(): Promise<AuthResponse> {
    const guestId = `guest-${Math.random().toString(36).substring(2, 9)}`;
    const guestUser: UserProfile = {
      id: guestId,
      email: `${guestId}@codequest.dev`,
      username: `Cadet_${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'PLAYER',
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockUsers.set(guestId, { ...guestUser, passwordHash: '' });
    const token = this.jwtService.sign({ sub: guestUser.id, role: guestUser.role, username: guestUser.username });

    return { token, user: guestUser };
  }

  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    if (!email || !username || !password) {
      throw new BadRequestException('Email, username, and password are required');
    }

    for (const u of this.mockUsers.values()) {
      if (u.email === email) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr-${Math.random().toString(36).substring(2, 10)}`;

    const newUser: UserProfile = {
      id: userId,
      email,
      username,
      role: 'PLAYER',
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockUsers.set(userId, { ...newUser, passwordHash });
    const token = this.jwtService.sign({ sub: newUser.id, role: newUser.role, username: newUser.username });

    return { token, user: newUser };
  }

  async googleAuth(email: string, name: string, avatarUrl?: string): Promise<AuthResponse> {
    if (!email) {
      throw new BadRequestException('Email is required for Google authentication');
    }

    let foundUser: any = null;
    for (const u of this.mockUsers.values()) {
      if (u.email === email) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      const userId = `usr-g-${Math.random().toString(36).substring(2, 10)}`;
      const newUser: UserProfile = {
        id: userId,
        email,
        username: name || email.split('@')[0],
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        role: 'PLAYER',
        xp: 100, // Starter Cadet Google Bonus
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockUsers.set(userId, { ...newUser, passwordHash: '' });
      foundUser = newUser;
    }

    const token = this.jwtService.sign({ sub: foundUser.id, role: foundUser.role, username: foundUser.username });
    const { passwordHash, ...profile } = foundUser;
    return { token, user: profile as UserProfile };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    let foundUser: any = null;
    for (const u of this.mockUsers.values()) {
      if (u.email === email) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userProfile: UserProfile = {
      id: foundUser.id,
      email: foundUser.email,
      username: foundUser.username,
      role: foundUser.role,
      xp: foundUser.xp,
      level: foundUser.level,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };

    const token = this.jwtService.sign({ sub: foundUser.id, role: foundUser.role, username: foundUser.username });
    return { token, user: userProfile };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = this.mockUsers.get(userId);
    if (!user) {
      throw new UnauthorizedException('User session not found');
    }
    const { passwordHash, ...profile } = user;
    return profile as UserProfile;
  }

  async addXp(userId: string, xpGain: number): Promise<UserProfile> {
    const user = this.mockUsers.get(userId);
    if (user) {
      user.xp += xpGain;
      user.level = Math.floor(user.xp / 250) + 1;
      user.updatedAt = new Date().toISOString();
      this.mockUsers.set(userId, user);
      const { passwordHash, ...profile } = user;
      return profile as UserProfile;
    }
    throw new BadRequestException('User not found');
  }
}

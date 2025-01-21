import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /*
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return user;
    }
    return null;
  }
*/

  async validateUser(email: string, password: string): Promise<any | null> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // Supprime le mot de passe avant de renvoyer l'utilisateur
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.userId, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'), // Exemple: '2 minutes'
      secret: this.configService.get<string>('JWT_SECRET'), // Secret clé
    });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '3800s' });

    // Sauvegarder le Refresh Token hashé dans la base de données
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateUserRefreshToken(
      user.userId,
      hashedRefreshToken,
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Récupérer l'utilisateur depuis l'email du Refresh Token
      const user = await this.userService.findByEmail(payload.email);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Vérifiez que le Refresh Token est valide
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Générer un nouveau Access Token et Refresh Token
      const newAccessToken = this.jwtService.sign(
        { email: user.email, sub: user.userId },
        { expiresIn: '3600s' },
      );
      const newRefreshToken = this.jwtService.sign(
        { email: user.email, sub: user.userId },
        { expiresIn: '3800s' },
      );

      // Sauvegarder le nouveau Refresh Token hashé dans la base
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.userService.updateUserRefreshToken(
        user.userId,
        hashedNewRefreshToken,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /*
  async login(loginUser: LoginDto) {
    const payload = {  email: loginUser.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
*/
  /*
  async register(createUserDto: CreateUserDto): Promise<any> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Update the DTO with the hashed password
    const userToCreate = { ...createUserDto, password: hashedPassword };

    // Delegate the user creation to the UserService
    return await this.userService.createUser(userToCreate);
  }
*/

  async register(user: Partial<User>): Promise<Partial<User>> {
    user.password = await bcrypt.hash(user.password, 10); // Hash le mot de passe
    return await this.userService.create(user);
  }
}

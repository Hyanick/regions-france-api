import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { PartialType } from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
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

    const userIsActive = (await this.userService.findByEmail(email)).isActive;
    if (!userIsActive) {
      throw new UnauthorizedException('Veuillez activer compte');
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

  async resendVerificationCode(userId: number): Promise<void> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    if (user.isVerified) {
      throw new BadRequestException("L'utilisateur est déjà vérifié");
    }

    // Génération d'un nouveau code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Mise à jour du code dans la base de données
    await this.userService.updateUser(user.userId, { verificationCode });

    // Envoi du code par email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Vérification de votre compte',
      template: 'verification', // Nom du fichier template sans extension
      context: {
        code: verificationCode, // Remplissage des variables {{ code }} dans le template
      },
    });
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

  async register(
    registerUserDto: Partial<RegisterUserDto>,
  ): Promise<Partial<User>> {
    // user.password = await bcrypt.hash(user.password, 10); // Hash le mot de passe
    return await this.userService.registerUser(registerUserDto);
  }

  async verifyCode(userId: number, code: string): Promise<User> {
    const user = await this.userService.findById(userId);

    // Rechercher l'utilisateur

    console.log('userId ', userId);
    console.log('user ', user);
    console.log('user.verificationCode ', user.verificationCode);
    console.log('code ', code);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    user.isVerified = true;
    user.verificationCode = null; // Nettoyer le code après vérification
    // return await this.updateUser(userId, { isVerified: true, verificationCode: null });
    return await this.userService.updateUser(userId, {
      isActive: true,
      isVerified: true,
    });
  }
}

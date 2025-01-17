import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  if (user && await bcrypt.compare(password, user.password)) {
    // Supprime le mot de passe avant de renvoyer l'utilisateur
    const { password, ...result } = user;
    return result;
  }
  return null;
}

async login(email: string, password: string): Promise<{ accessToken: string }> {
  const user = await this.validateUser(email, password);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = { userId: user.userId, email: user.email };
  const accessToken = this.jwtService.sign(payload);
  return { accessToken };
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

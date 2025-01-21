import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { VerificationService } from './verification.service';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private verificationService: VerificationService, // Service pour gérer le code de vérification
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Méthode pour créer un utilisateur

  async registerUser(registerUserDto: Partial<RegisterUserDto>): Promise<Partial<User>> {
    const {firstName, lastName, email, password } = registerUserDto;

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    //Récupère le code
    const verificationCode =
    await this.verificationService.generateVerificationCode(); // Générer un code

    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isActive: false, // L'utilisateur est inactif tant que l'e-mail n'est pas vérifié
      verificationCode,
      
    });
    // Sauvegarder l'utilisateur dans la base de données
    const savedUser = await this.userRepository.save(newUser);



    // Envoyer un email ou SMS
    if (registerUserDto.phoneNumber) {
      await this.verificationService.sendSms(
        registerUserDto.phoneNumber,
        verificationCode,
      );
    } else {
      await this.verificationService.sendEmail(
        registerUserDto.email,
        verificationCode,
      );
    }

    // Retourner uniquement le firstname, le lastName, l'email et le mot de passe
    return {
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      password: savedUser.password,
      userId: savedUser.userId
    };
  }

  /* async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Créer une nouvelle instance de User avec les données du DTO
      //const newUser = this.userRepository.create(createUserDto);
      // Mapper le DTO vers l'entité User
      const userToCreate = plainToInstance(User, createUserDto);

      // Sauvegarder dans la base de données
      return await this.userRepository.save(userToCreate);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }*/
  async updateUser(
    userId: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  async updateProfilePicture(userId: number, filePath: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profilePicture = filePath;
    await this.userRepository.save(user);
  }

  async getProfilePicturePath(userId: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user || !user.profilePicture) {
      throw new NotFoundException('User or profile picture not found');
    }

    return user.profilePicture; // Retourne le chemin de l'image stocké dans la base de données
  }

  async updateUserRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new Error('User not found');
    }
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }
}

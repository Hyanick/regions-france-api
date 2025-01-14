import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ userId });
  }

  // Méthode pour créer un utilisateur

    /*
  create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
  */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Créer une nouvelle instance de User avec les données du DTO
      const newUser = this.userRepository.create(createUserDto);

      // Sauvegarder dans la base de données
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }


  async update(userId: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, user);
    return this.findById(userId);
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
}

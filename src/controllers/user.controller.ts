import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadFileDto } from 'src/dtos/upload-file.dto';
import { User } from 'src/entities/user.entity';
import { FileService } from 'src/services/file.service';
import { UserService } from '../services/user.service';

import * as path from 'path';
import * as fs from 'fs';

@ApiTags('Users') // Regroupe les routes du contrôleur sous "Users" dans Swagger
@Controller('api/users')
export class UserController {
  private readonly uploads = 'C:\\Devs\\RegionsFrance\\Photos_Profils';
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'Data for the new user',
    type: User,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to update',
    example: 1,
  })
  @ApiBody({
    description: 'Updated data for the user',
    type: User,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(@Param('id') id: number, @Body() user: User): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
  @Post(':id/upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // Définir le répertoire absolu sur votre disque local
        destination: (req, file, callback) => {
          const uploadDir = path.join('C:', 'mon_dossier', 'uploads'); // Utilisation correcte du chemin absolu

          // Créer le répertoire si nécessaire
          if (!require('fs').existsSync(uploadDir)) {
            require('fs').mkdirSync(uploadDir, { recursive: true });
          }

          callback(null, uploadDir); // Utiliser le répertoire local
        },
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          callback(null, uniqueName); // Nom unique du fichier
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a profile picture for a user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "Upload d'une image",
    type: UploadFileDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Profile picture uploaded successfully',
  })
  async uploadProfilePicture(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Spécifier le chemin absolu correct pour le fichier
    const filePath = path.join('C:', 'mon_dossier', 'uploads', file.filename); // Chemin absolu du fichier

    // Mettre à jour le profil de l'utilisateur avec le chemin du fichier
    await this.userService.updateProfilePicture(id, filePath);

    return { message: 'Profile picture uploaded successfully', path: filePath };
  }

  @Get('profile-picture/:fileName')
  @ApiOperation({ summary: 'Retrieve a user’s profile picture' })
  @ApiParam({
    name: 'fileName',
    description: 'Name of the file',
    example: 'profile-1.jpg',
  })
  async getProfilePicture(@Param('fileName') fileName: string, @Res() res) {
    const filePath = path.join('C:', 'mon_dossier', 'uploads', fileName); // Utilisation correcte du chemin absolu

    console.log('');

    const file = await this.fileService.getFile(filePath);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(file);
  }

  @Get(':userId/profile-picture')
  @ApiOperation({ summary: 'Retrieve a user’s profile picture by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 1,
  })
  async getProfilePictureById(@Param('userId') userId: number, @Res() res) {
    // Récupère le chemin de la photo depuis le service utilisateur
    const filePath = await this.userService.getProfilePicturePath(userId);
    console.log('filePath---> controller', filePath);
    

    // Vérifie si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Profile picture not found');
    }

    // Récupère et envoie le fichier
    const fileExtension = path.extname(filePath).toLowerCase();
    const mimeType =
      {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
      }[fileExtension] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.sendFile(filePath); // Envoie le fichier au client


    
  }
}

/*

  @Post(':id/upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a profile picture for a user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload d\'une image',
    type: UploadFileDto , // Indique que ce corps de requête est un formulaire multipart
    // Swagger a besoin d'un "type" d'objet pour afficher un champ de fichier
  })
  @ApiResponse({
    status: 201,
    description: 'Profile picture uploaded successfully',
  })
  async uploadProfilePicture(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = `uploads/${file.filename}`;
    await this.userService.updateProfilePicture(id, filePath);
    return { message: 'Profile picture uploaded successfully', path: filePath };
  }

  @Get('profile-picture/:fileName')
  @ApiOperation({ summary: 'Retrieve a user’s profile picture' })
  @ApiParam({
    name: 'fileName',
    description: 'Name of the file',
    example: 'profile-1.jpg',
  })
  async getProfilePicture(@Param('fileName') fileName: string, @Res() res) {
    const file = await this.fileService.getFile(`uploads/${fileName}`);
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(file);
  }
  */

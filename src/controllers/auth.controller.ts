import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { log } from 'console';
import { LoginDto } from 'src/dtos/login.dto';
import { RefreshTokenDto } from 'src/dtos/refresh-token.dto';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Customize HTTP response code
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid email or password.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'The login credentials (email and password).',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiBody({
    type: RegisterUserDto,
    description: 'The data required to create a new user.',
  })
  async register(
    @Body()
    body: {
      firstName;
      string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard('jwt')) // Protéger la route avec le guard JWT
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user.userId; // Récupérer l'ID utilisateur depuis le token
    log('req selected', req)
    log('req.user selected', req.user)
    log('userId selected', userId)
    return this.userService.findById(userId); // Récupérer les informations utilisateur
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    return this.authService.refresh(refreshToken);
  }
}

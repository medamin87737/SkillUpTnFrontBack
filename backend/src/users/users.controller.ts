import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth/auth.service';
import { JwtAuthGuard } from '../auth/auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/auth/roles.decorator';
import { RolesGuard } from '../auth/auth/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly authService: AuthService,
  ) {}

  /** Inscription - ouvert à tous */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /** Connexion - ouvert à tous */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const { access_token } = await this.authService.login(user);
    return { message: 'Connexion réussie', user: this.usersService.sanitizeUser(user), token: access_token };
  }

  /** Get all users - HR or ADMIN */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN')
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return { success: true, message: 'Liste des utilisateurs', data: users, count: users.length };
  }

  /** Get one user by ID - HR, MANAGER or ADMIN */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR', 'MANAGER', 'ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { success: true, message: 'Utilisateur récupéré', data: user };
  }

  /** Update user by ID - HR or ADMIN */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN')
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateById(id, updateUserDto);
  }

  /** Delete user by ID - HR or ADMIN */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }

  /** Mettre à jour le statut en ligne - Authentifié */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/online-status')
  async updateOnlineStatus(
    @Param('id') id: string,
    @Body('en_ligne') en_ligne: boolean,
  ) {
    return this.usersService.updateOnlineStatus(id, en_ligne);
  }
}

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
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth/auth.service';
import { JwtAuthGuard } from '../auth/auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/auth/roles.decorator';
import { RolesGuard } from '../auth/auth/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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

  /**
   * Importer des utilisateurs depuis un fichier CSV
   * Accessible aux rôles HR et ADMIN uniquement.
   *
   * Format CSV attendu (séparateur , ou ;) avec en-tête :
   * name,matricule,telephone,email,date_embauche[,role,status,department_id,manager_id,password]
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HR', 'ADMIN')
  @Post('import-csv')
  @UseInterceptors(FileInterceptor('file'))
  async importFromCsv(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Aucun fichier CSV reçu');
    }

    const content = file.buffer.toString('utf-8');
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      throw new BadRequestException('Le fichier CSV ne contient aucune donnée');
    }

    const headerLine = lines[0];
    const commaCount = (headerLine.match(/,/g) || []).length;
    const semicolonCount = (headerLine.match(/;/g) || []).length;
    const delimiter = semicolonCount > commaCount ? ';' : ',';

    const headers = headerLine
      .split(delimiter)
      .map((h) => h.trim().toLowerCase());

    const requiredHeaders = ['name', 'matricule', 'telephone', 'email', 'date_embauche'];
    for (const h of requiredHeaders) {
      if (!headers.includes(h)) {
        throw new BadRequestException(
          `Colonne requise manquante dans le CSV: "${h}"`,
        );
      }
    }

    const createdUsers: any[] = [];
    const errors: { line: number; reason: string; raw: string }[] = [];

    // Traiter chaque ligne de données
    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i].trim();
      if (!raw) continue;

      const parts = raw.split(delimiter).map((p) => p.trim());
      if (parts.length !== headers.length) {
        errors.push({
          line: i + 1,
          reason: 'Nombre de colonnes incorrect',
          raw,
        });
        continue;
      }

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx];
      });

      const dto: Partial<CreateUserDto> = {
        name: row['name'],
        matricule: row['matricule'],
        telephone: row['telephone'],
        email: row['email'],
        date_embauche: row['date_embauche'],
      };

      // Mot de passe : soit colonne password, soit mot de passe par défaut fort
      dto.password =
        row['password'] && row['password'].length >= 8
          ? row['password']
          : 'Password123!';

      if (row['status']) {
        dto.status = row['status'].toUpperCase() as any;
      }
      if (row['role']) {
        dto.role = row['role'].toUpperCase() as any;
      }
      if (row['department_id']) {
        dto.department_id = row['department_id'];
      }
      if (row['manager_id']) {
        dto.manager_id = row['manager_id'];
      }

      try {
        const result = await this.usersService.create(dto as CreateUserDto);
        const user = (result as any).user ?? result;
        createdUsers.push(user);
      } catch (error: any) {
        errors.push({
          line: i + 1,
          reason: error?.message ?? 'Erreur lors de la création utilisateur',
          raw,
        });
      }
    }

    return {
      success: true,
      message: `Import terminé: ${createdUsers.length} utilisateurs créés, ${errors.length} lignes ignorées`,
      createdCount: createdUsers.length,
      errorCount: errors.length,
      created: createdUsers,
      errors,
    };
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

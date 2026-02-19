import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Créer un nouvel utilisateur (inscription)
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      // Vérifier si l'email existe déjà
      const existingUserByEmail = await this.userModel.findOne({
        email: createUserDto.email.toLowerCase(),
      });

      if (existingUserByEmail) {
        throw new ConflictException('Cet email est déjà utilisé');
      }

      // Vérifier si le matricule existe déjà
      const existingUserByMatricule = await this.userModel.findOne({
        matricule: createUserDto.matricule,
      });

      if (existingUserByMatricule) {
        throw new ConflictException('Ce matricule est déjà utilisé');
      }

      // Vérifier que le manager existe si manager_id est fourni
      if (createUserDto.manager_id) {
        if (!isValidObjectId(createUserDto.manager_id)) {
          throw new BadRequestException('ID du manager invalide');
        }
        const manager = await this.userModel.findById(createUserDto.manager_id);
        if (!manager) {
          throw new NotFoundException('Manager non trouvé');
        }
      }

      // Hasher le mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      // Préparer les données utilisateur
      const userData: any = {
        name: createUserDto.name,
        matricule: createUserDto.matricule,
        telephone: createUserDto.telephone,
        email: createUserDto.email.toLowerCase(),
        password: hashedPassword,
        date_embauche: new Date(createUserDto.date_embauche),
        status: createUserDto.status || UserStatus.ACTIVE,
        role: createUserDto.role || UserRole.EMPLOYEE,
        en_ligne: false,
      };

      // Convertir department_id en ObjectId si fourni
      if (createUserDto.department_id) {
        if (!isValidObjectId(createUserDto.department_id)) {
          throw new BadRequestException('ID du département invalide');
        }
        userData.department_id = new Types.ObjectId(createUserDto.department_id);
      }

      // Convertir manager_id en ObjectId si fourni
      if (createUserDto.manager_id) {
        userData.manager_id = new Types.ObjectId(createUserDto.manager_id);
      }

      // Créer l'utilisateur
      const newUser = new this.userModel(userData);
      const savedUser = await newUser.save();

      // Retourner sans le mot de passe
      return {
        message: 'Utilisateur créé avec succès',
        user: this.sanitizeUser(savedUser),
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        "Erreur lors de la création de l'utilisateur: " + error.message,
      );
    }
  }

  /**
   * Connexion utilisateur
   */
  async login(loginUserDto: LoginUserDto): Promise<any> {
    try {
      // Trouver l'utilisateur par email
      const user = await this.userModel.findOne({
        email: loginUserDto.email.toLowerCase(),
      });

      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // Vérifier si le compte est actif (utiliser status au lieu de isActive)
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException(
          "Votre compte n'est pas actif. Contactez l'administrateur",
        );
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // Mettre à jour le statut en ligne
      user.en_ligne = true;
      await user.save();

      // Retourner les informations utilisateur
      return {
        message: 'Connexion réussie',
        user: this.sanitizeUser(user),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        'Erreur lors de la connexion: ' + error.message,
      );
    }
  }

  /**
   * Trouver tous les utilisateurs
   */
  async findAll(): Promise<any[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.sanitizeUser(user));
  }

  /**
   * Trouver un utilisateur par ID
   */
  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Trouver un utilisateur par email (pour usage interne)
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  /**
   * Supprimer les informations sensibles de l'utilisateur
   */

  // rendre sanitizeUser publique pour controller Auth
  sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    const { password, __v, ...sanitizedUser } = userObj;
    return sanitizedUser;
  }

  /**
   * Mettre à jour un utilisateur par ID
   */
  async updateById(id: string, dto: any) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    // Préparer les données de mise à jour
    const updateData: any = { ...dto };

    // Convertir date_embauche en Date si fourni
    if (dto.date_embauche) {
      updateData.date_embauche = new Date(dto.date_embauche);
    }

    // Convertir department_id en ObjectId si fourni
    if (dto.department_id) {
      if (!isValidObjectId(dto.department_id)) {
        throw new BadRequestException('ID du département invalide');
      }
      updateData.department_id = new Types.ObjectId(dto.department_id);
    }

    // Convertir manager_id en ObjectId si fourni
    if (dto.manager_id) {
      if (!isValidObjectId(dto.manager_id)) {
        throw new BadRequestException('ID du manager invalide');
      }
      // Vérifier que le manager existe
      const manager = await this.userModel.findById(dto.manager_id);
      if (!manager) {
        throw new NotFoundException('Manager non trouvé');
      }
      updateData.manager_id = new Types.ObjectId(dto.manager_id);
    }

    // Hasher le mot de passe si fourni
    if (dto.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(dto.password, saltRounds);
    }

    const updated = await this.userModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );

    if (!updated) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      message: 'Utilisateur mis à jour avec succès',
      user: this.sanitizeUser(updated),
    };
  }


  /**
   * Supprimer un utilisateur par ID
   */
  async deleteById(id: string): Promise<any> {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      message: 'Utilisateur supprimé avec succès',
      user: this.sanitizeUser(deleted),
    };
  }

  /**
   * Mettre à jour le statut en ligne d'un utilisateur
   */
  async updateOnlineStatus(id: string, isOnline: boolean): Promise<any> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    const updated = await this.userModel.findByIdAndUpdate(
      id,
      { en_ligne: isOnline },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      message: `Statut en ligne mis à jour: ${isOnline ? 'en ligne' : 'hors ligne'}`,
      user: this.sanitizeUser(updated),
    };
  }

}

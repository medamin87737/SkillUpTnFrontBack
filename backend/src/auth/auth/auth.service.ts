import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    // Valide l'utilisateur avant de générer un token
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        // Vérifier le statut de l'utilisateur
        if (user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException(
                "Votre compte n'est pas actif. Contactez l'administrateur",
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return user;
    }

    // Génère le token JWT
    async login(user: any) {
        const payload = { sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

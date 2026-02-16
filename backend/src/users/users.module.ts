import {forwardRef, Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { Department, DepartmentSchema } from './schemas/department.schema';
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
    forwardRef(() => AuthModule), // Permet d'éviter la dépendance circulaire

  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporter pour utiliser dans d'autres modules
})
export class UsersModule {}

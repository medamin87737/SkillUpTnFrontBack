import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from '../schemas/department.schema';
import { UserRole, UserStatus } from '../schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const departmentModel = app.get<Model<DepartmentDocument>>(
    getModelToken(Department.name),
  );

  try {
    console.log('🌱 Démarrage du seed des utilisateurs...\n');

    // 1. Créer des départements si nécessaire
    console.log('📁 Création des départements...');
    const departments = [
      { name: 'IT', description: 'Département Technologies de l\'Information' },
      { name: 'RH', description: 'Ressources Humaines' },
      { name: 'Finance', description: 'Département Financier' },
      { name: 'Marketing', description: 'Département Marketing' },
      { name: 'Operations', description: 'Département Opérations' },
    ];

    const createdDepartments: any[] = [];
    for (const dept of departments) {
      let department = await departmentModel.findOne({ name: dept.name });
      if (!department) {
        department = await departmentModel.create(dept);
        console.log(`  ✓ Département créé: ${dept.name}`);
      } else {
        console.log(`  → Département existant: ${dept.name}`);
      }
      createdDepartments.push(department);
    }

    // 2. Créer des utilisateurs
    console.log('\n👥 Création des utilisateurs...\n');

    const users = [
      {
        name: 'Admin Principal',
        matricule: 'ADM001',
        telephone: '+21612345678',
        email: 'admin@example.com',
        password: 'Admin123!',
        date_embauche: '2020-01-15',
        department_id: createdDepartments[1]._id.toString(), // RH
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN,
      },
      {
        name: 'Sarah Ben Ali',
        matricule: 'HR001',
        telephone: '+21623456789',
        email: 'hr@example.com',
        password: 'Hr123456!',
        date_embauche: '2021-03-20',
        department_id: createdDepartments[1]._id.toString(), // RH
        status: UserStatus.ACTIVE,
        role: UserRole.HR,
      },
      {
        name: 'Mohamed Trabelsi',
        matricule: 'MGR001',
        telephone: '+21634567890',
        email: 'manager@example.com',
        password: 'Manager123!',
        date_embauche: '2022-05-10',
        department_id: createdDepartments[0]._id.toString(), // IT
        status: UserStatus.ACTIVE,
        role: UserRole.MANAGER,
      },
      {
        name: 'Ahmed Ben Salah',
        matricule: 'EMP001',
        telephone: '+21645678901',
        email: 'ahmed@example.com',
        password: 'Employee123!',
        date_embauche: '2023-06-01',
        department_id: createdDepartments[0]._id.toString(), // IT
        status: UserStatus.ACTIVE,
        role: UserRole.EMPLOYEE,
      },
      {
        name: 'Fatma Khelifi',
        matricule: 'EMP002',
        telephone: '+21656789012',
        email: 'fatma@example.com',
        password: 'Employee123!',
        date_embauche: '2023-07-15',
        department_id: createdDepartments[0]._id.toString(), // IT
        status: UserStatus.ACTIVE,
        role: UserRole.EMPLOYEE,
      },
      {
        name: 'Youssef Mezghani',
        matricule: 'EMP003',
        telephone: '+21667890123',
        email: 'youssef@example.com',
        password: 'Employee123!',
        date_embauche: '2023-08-20',
        department_id: createdDepartments[2]._id.toString(), // Finance
        status: UserStatus.ACTIVE,
        role: UserRole.EMPLOYEE,
      },
    ];

    const createdUsers: any[] = [];

    for (const userData of users) {
      try {
        const result = await usersService.create(userData);
        createdUsers.push(result.user);
        console.log(`  ✓ Utilisateur créé: ${userData.name} (${userData.email})`);
      } catch (error: any) {
        if (error.message?.includes('déjà utilisé')) {
          console.log(`  → Utilisateur existant: ${userData.email}`);
        } else {
          console.error(`  ✗ Erreur pour ${userData.email}: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Seed terminé ! ${createdUsers.length} utilisateur(s) créé(s).`);
    console.log('\n📋 Résumé des utilisateurs créés:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    createdUsers.forEach((user) => {
      console.log(`  • ${user.name} - ${user.email}`);
      console.log(`    Matricule: ${user.matricule} | Tél: ${user.telephone}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

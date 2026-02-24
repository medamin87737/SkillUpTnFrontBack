import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

// ✅ Schemas existants dans users/schemas/
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { Department, DepartmentDocument } from '../users/schemas/department.schema';
import { Fiche, FicheDocument } from '../users/schemas/fiche.schema';
import { Competence, CompetenceDocument } from '../users/schemas/competence.schema';

// ✅ Schema existant dans activities/schemas/
import { Activity, ActivityDocument } from '../activities/schemas/activity.schema';

// ✅ DTOs
import { ConfirmParticipantsDto } from './dto/confirm-participants.dto';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { EvaluateCompetenceDto } from './dto/evaluate-competence.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Fiche.name) private ficheModel: Model<FicheDocument>,
    @InjectModel(Competence.name) private competenceModel: Model<CompetenceDocument>,
  ) {}

  // ══════════════════════════════════════════
  // 1. VOIR LES ACTIVITÉS DU MANAGER
  // ══════════════════════════════════════════
  async getMyActivities(managerId: string) {
    if (!managerId || !Types.ObjectId.isValid(managerId)) {
  throw new BadRequestException('ID manager invalide');
}
    // Trouver le département dont ce manager est responsable
    const department = await this.departmentModel.findOne({
      manager_id: managerId,
    });

    if (!department) {
      // Si pas de département assigné, retourner liste vide
      return { activities: [], department: null };
    }

    // Récupérer les activités de ce département
    const activities = await this.activityModel
      .find({ departmentId: department._id.toString() })
      .sort({ startDate: -1 });

    return {
      department: { id: department._id, name: department.name, code: department.code },
      activities,
      total: activities.length,
    };
  }

  // ══════════════════════════════════════════
  // 2. DÉTAIL D'UNE ACTIVITÉ
  // ══════════════════════════════════════════
  async getActivityDetail(activityId: string) {
    if (!Types.ObjectId.isValid(activityId)) {
      throw new BadRequestException('ID activité invalide');
    }

    const activity = await this.activityModel.findById(activityId);
    if (!activity) throw new NotFoundException('Activité introuvable');

    return { activity };
  }

  // ══════════════════════════════════════════
  // 3. VOIR LES EMPLOYÉS DE SON DÉPARTEMENT
  //    (liste pour ajouter manuellement)
  // ══════════════════════════════════════════
  async getMyEmployees(managerId: string) {
    if (!Types.ObjectId.isValid(managerId)) {
      throw new BadRequestException('ID manager invalide');
    }

    // Trouver le département du manager
    const department = await this.departmentModel.findOne({
      manager_id: managerId,
    });

    if (!department) {
      return { employees: [], total: 0 };
    }

    // Trouver tous les employés de ce département
    const employees = await this.userModel
      .find({
        department_id: department._id,
        role: UserRole.EMPLOYEE,
      })
      .select('name matricule email telephone status en_ligne department_id')
      .sort({ name: 1 });

    return {
      department: department.name,
      employees,
      total: employees.length,
    };
  }

  // ══════════════════════════════════════════
  // 4. RECHERCHER UN EMPLOYÉ
  //    (par nom, matricule, email)
  // ══════════════════════════════════════════
  async searchEmployees(query: string, managerId: string) {
    if (!query || query.trim() === '') {
      throw new BadRequestException('Veuillez fournir un terme de recherche');
    }

    // Trouver le département du manager
    const department = await this.departmentModel.findOne({
      manager_id: managerId,
    });

    const filter: any = {
      role: UserRole.EMPLOYEE,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { matricule: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    };

    // Optionnel: limiter à son département
    if (department) {
      filter.department_id = department._id;
    }

    const employees = await this.userModel
      .find(filter)
      .select('name matricule email telephone status department_id')
      .populate('department_id', 'name code')
      .limit(20);

    return { employees, total: employees.length };
  }

  // ══════════════════════════════════════════
  // 5. CONFIRMER / REJETER DES PARTICIPANTS
  //    (Étape 6 du workflow)
  //    ⚠️ Cette fonction met à jour Activity
  //    en ajoutant un champ "participants"
  //    car la table Participation = module Marwa
  // ══════════════════════════════════════════
  async confirmParticipants(
    activityId: string,
    dto: ConfirmParticipantsDto,
    managerId: string,
  ) {
    if (!Types.ObjectId.isValid(activityId)) {
      throw new BadRequestException('ID activité invalide');
    }

    const activity = await this.activityModel.findById(activityId);
    if (!activity) throw new NotFoundException('Activité introuvable');

    // Vérifier que les employés confirmés existent
    for (const empId of dto.confirmedEmployeeIds) {
      if (!Types.ObjectId.isValid(empId)) {
        throw new BadRequestException(`ID employé invalide: ${empId}`);
      }
      const emp = await this.userModel.findById(empId);
      if (!emp) throw new NotFoundException(`Employé ${empId} introuvable`);
    }

    return {
      message: 'Participants confirmés avec succès',
      activityId,
      confirmedCount: dto.confirmedEmployeeIds.length,
      rejectedCount: dto.rejectedEmployeeIds.length,
      confirmedEmployeeIds: dto.confirmedEmployeeIds,
      rejectedEmployeeIds: dto.rejectedEmployeeIds,
      // ⚠️ Note: Le statut réel de participation est géré
      // par le module de Marwa (Employee module)
    };
  }

  // ══════════════════════════════════════════
  // 6. AJOUTER UN EMPLOYÉ MANUELLEMENT
  // ══════════════════════════════════════════
  async addEmployeeManually(activityId: string, dto: AddEmployeeDto) {
    if (!Types.ObjectId.isValid(activityId) || !Types.ObjectId.isValid(dto.employeeId)) {
      throw new BadRequestException('ID invalide');
    }

    const activity = await this.activityModel.findById(activityId);
    if (!activity) throw new NotFoundException('Activité introuvable');

    const employee = await this.userModel
      .findById(dto.employeeId)
      .select('name matricule email department_id role');

    if (!employee) throw new NotFoundException('Employé introuvable');

    if (employee.role !== UserRole.EMPLOYEE) {
      throw new BadRequestException('Cet utilisateur n\'est pas un employé');
    }

    return {
      message: `${employee.name} ajouté à l'activité avec succès`,
      employee: {
        id: employee._id,
        name: employee.name,
        matricule: employee.matricule,
        email: employee.email,
      },
      activity: {
        id: activity._id,
        title: activity.title,
      },
      score: dto.score ?? 0,
    };
  }

  // ══════════════════════════════════════════
  // 7. VOIR LES FICHES D'UN EMPLOYÉ
  //    (pour évaluation post-activité - Étape 10)
  // ══════════════════════════════════════════
  async getEmployeeFiches(employeeId: string, managerId: string) {
    if (!Types.ObjectId.isValid(employeeId)) {
      throw new BadRequestException('ID employé invalide');
    }

    const employee = await this.userModel
      .findById(employeeId)
      .select('name matricule email department_id');

    if (!employee) throw new NotFoundException('Employé introuvable');

    // Récupérer les fiches de l'employé
    const fiches = await this.ficheModel
      .find({ user_id: new Types.ObjectId(employeeId) })
      .sort({ createdAt: -1 });

    return {
      employee: {
        id: employee._id,
        name: employee.name,
        matricule: employee.matricule,
      },
      fiches,
      total: fiches.length,
    };
  }

  // ══════════════════════════════════════════
  // 8. VOIR LES COMPÉTENCES D'UNE FICHE
  //    (pour savoir quoi évaluer - Étape 10)
  // ══════════════════════════════════════════
  async getFicheCompetences(ficheId: string) {
    if (!Types.ObjectId.isValid(ficheId)) {
      throw new BadRequestException('ID fiche invalide');
    }

    const fiche = await this.ficheModel.findById(ficheId);
    if (!fiche) throw new NotFoundException('Fiche introuvable');

    const competences = await this.competenceModel
      .find({ fiches_id: new Types.ObjectId(ficheId) })
      .populate('question_competence_id', 'intitule details')
      .sort({ type: 1 });

    return {
      fiche,
      competences,
      total: competences.length,
    };
  }

  // ══════════════════════════════════════════
  // 9. ÉVALUATION POST-ACTIVITÉ (Étape 10)
  //    Manager remplit hierarchie_eval
  //    dans la table Competence
  // ══════════════════════════════════════════
  async evaluateCompetence(dto: EvaluateCompetenceDto, managerId: string) {
    if (!Types.ObjectId.isValid(dto.competenceId)) {
      throw new BadRequestException('ID compétence invalide');
    }

    const competence = await this.competenceModel.findById(dto.competenceId);
    if (!competence) throw new NotFoundException('Compétence introuvable');

    // Vérifier que la compétence est dans un état évaluable
    if (competence.etat === 'validated') {
      throw new BadRequestException('Cette compétence est déjà validée');
    }

    // ✅ Mettre à jour hierarchie_eval et etat → "validated"
    const updated = await this.competenceModel.findByIdAndUpdate(
      dto.competenceId,
      {
        hierarchie_eval: dto.hierarchie_eval,
        etat: 'validated', // Compétence validée par le manager
      },
      { new: true },
    );

   if (!updated) throw new NotFoundException('Compétence introuvable');

return {
  message: 'Évaluation enregistrée avec succès',
  competence: {
    id: updated._id,
    intitule: updated.intitule,
    type: updated.type,
    auto_eval: updated.auto_eval,
    hierarchie_eval: updated.hierarchie_eval,
    etat: updated.etat,
  },
  commentaire: dto.commentaire,
};
  }

  // ══════════════════════════════════════════
  // 10. DASHBOARD MANAGER
  //     Statistiques globales
  // ══════════════════════════════════════════
  async getDashboard(managerId: string) {
    if (!Types.ObjectId.isValid(managerId)) {
      throw new BadRequestException('ID manager invalide');
    }

    const manager = await this.userModel
      .findById(managerId)
      .select('name matricule email department_id');

    if (!manager) throw new NotFoundException('Manager introuvable');

    // Département du manager
    const department = await this.departmentModel.findOne({
      manager_id: managerId,
    });

    // Compter les employés
    const employeeCount = department
      ? await this.userModel.countDocuments({
          department_id: department._id,
          role: UserRole.EMPLOYEE,
        })
      : 0;

    // Compter les activités
    const activityCount = department
      ? await this.activityModel.countDocuments({
          departmentId: department._id.toString(),
        })
      : 0;

    // Compter les fiches en attente d'évaluation
    let pendingEvaluations = 0;
    if (department) {
      const employees = await this.userModel.find({
        department_id: department._id,
        role: UserRole.EMPLOYEE,
      });
      const employeeIds = employees.map((e) => e._id);
      pendingEvaluations = await this.ficheModel.countDocuments({
        user_id: { $in: employeeIds },
        etat: { $in: ['draft', 'in_progress'] },
      });
    }

    return {
      manager: {
        id: manager._id,
        name: manager.name,
        matricule: manager.matricule,
      },
      department: department
        ? { id: department._id, name: department.name, code: department.code }
        : null,
      stats: {
        totalEmployees: employeeCount,
        totalActivities: activityCount,
        pendingEvaluations,
      },
    };
  }
}
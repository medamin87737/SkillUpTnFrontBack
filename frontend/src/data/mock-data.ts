import type {
  User, Department, Activity, Recommendation,
  Notification, QuestionCompetence, Competence, Fiche,
  DepartmentSkillStats, SkillGap, ProgressionData
} from '../types'

// ============ DEPARTMENTS ============
export const departments: Department[] = [
  { id: '1', name: 'Direction Technique', code: 'DT', description: 'Department technique et IT', manager_id: '2', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '2', name: 'Ressources Humaines', code: 'RH', description: 'Gestion des ressources humaines', manager_id: '3', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '3', name: 'Finance & Comptabilite', code: 'FIN', description: 'Department financier', manager_id: '5', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '4', name: 'Assurance Automobile', code: 'AUTO', description: 'Branch assurance automobile', manager_id: '6', created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '5', name: 'Assurance Vie', code: 'VIE', description: 'Branch assurance vie', manager_id: '7', created_at: '2024-01-15', updated_at: '2024-01-15' },
]

// ============ USERS ============
export const users: User[] = [
  { id: '1', name: 'Admin Systeme', matricule: 'ADM001', telephone: '+216 71 000 001', email: 'admin@maghrebia.tn', password: 'hashed', date_embauche: '2020-01-01', departement_id: '1', manager_id: null, status: 'active', en_ligne: true, role: 'ADMIN' },
  { id: '2', name: 'Sami Ben Ali', matricule: 'MGR001', telephone: '+216 71 000 002', email: 'sami.benali@maghrebia.tn', password: 'hashed', date_embauche: '2019-03-15', departement_id: '1', manager_id: '1', status: 'active', en_ligne: true, role: 'MANAGER' },
  { id: '3', name: 'Fatma Trabelsi', matricule: 'HR001', telephone: '+216 71 000 003', email: 'fatma.trabelsi@maghrebia.tn', password: 'hashed', date_embauche: '2021-06-10', departement_id: '2', manager_id: '1', status: 'active', en_ligne: true, role: 'HR' },
  { id: '4', name: 'Ahmed Khelifi', matricule: 'EMP001', telephone: '+216 71 000 004', email: 'ahmed.khelifi@maghrebia.tn', password: 'hashed', date_embauche: '2022-09-01', departement_id: '1', manager_id: '2', status: 'active', en_ligne: false, role: 'EMPLOYEE' },
  { id: '5', name: 'Leila Mansouri', matricule: 'MGR002', telephone: '+216 71 000 005', email: 'leila.mansouri@maghrebia.tn', password: 'hashed', date_embauche: '2018-11-20', departement_id: '3', manager_id: '1', status: 'active', en_ligne: true, role: 'MANAGER' },
  { id: '6', name: 'Mohamed Chaabane', matricule: 'MGR003', telephone: '+216 71 000 006', email: 'mohamed.chaabane@maghrebia.tn', password: 'hashed', date_embauche: '2017-05-12', departement_id: '4', manager_id: '1', status: 'active', en_ligne: false, role: 'MANAGER' },
  { id: '7', name: 'Nour Hamdi', matricule: 'MGR004', telephone: '+216 71 000 007', email: 'nour.hamdi@maghrebia.tn', password: 'hashed', date_embauche: '2020-02-28', departement_id: '5', manager_id: '1', status: 'active', en_ligne: true, role: 'MANAGER' },
  { id: '8', name: 'Youssef Dridi', matricule: 'EMP002', telephone: '+216 71 000 008', email: 'youssef.dridi@maghrebia.tn', password: 'hashed', date_embauche: '2023-01-10', departement_id: '1', manager_id: '2', status: 'active', en_ligne: true, role: 'EMPLOYEE' },
  { id: '9', name: 'Amira Sassi', matricule: 'EMP003', telephone: '+216 71 000 009', email: 'amira.sassi@maghrebia.tn', password: 'hashed', date_embauche: '2022-04-05', departement_id: '3', manager_id: '5', status: 'active', en_ligne: false, role: 'EMPLOYEE' },
  { id: '10', name: 'Karim Bouaziz', matricule: 'EMP004', telephone: '+216 71 000 010', email: 'karim.bouaziz@maghrebia.tn', password: 'hashed', date_embauche: '2021-08-22', departement_id: '4', manager_id: '6', status: 'active', en_ligne: true, role: 'EMPLOYEE' },
  { id: '11', name: 'Ines Gharbi', matricule: 'EMP005', telephone: '+216 71 000 011', email: 'ines.gharbi@maghrebia.tn', password: 'hashed', date_embauche: '2023-03-18', departement_id: '5', manager_id: '7', status: 'active', en_ligne: true, role: 'EMPLOYEE' },
  { id: '12', name: 'Rami Mejri', matricule: 'EMP006', telephone: '+216 71 000 012', email: 'rami.mejri@maghrebia.tn', password: 'hashed', date_embauche: '2020-07-14', departement_id: '1', manager_id: '2', status: 'active', en_ligne: false, role: 'EMPLOYEE' },
]

// ============ QUESTION COMPETENCES ============
export const questionCompetences: QuestionCompetence[] = [
  { id: '1', intitule: 'Technical Skills', details: 'Programming, system administration, database management', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '2', intitule: 'Soft Skills', details: 'Communication, teamwork, leadership', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '3', intitule: 'Hard Skills', details: 'Industry-specific technical competencies', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '4', intitule: 'Managerial Skills', details: 'Project management, strategic planning, decision making', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '5', intitule: 'Insurance Knowledge', details: 'Insurance regulations, risk assessment, actuarial concepts', status: 'active', created_at: '2024-01-01', updated_at: '2024-01-01' },
]

// ============ FICHES ============
export const fiches: Fiche[] = [
  { id: '1', user_id: '4', saisons: '2025', etat: 'validated', created_at: '2025-01-15', updated_at: '2025-06-15' },
  { id: '2', user_id: '8', saisons: '2025', etat: 'completed', created_at: '2025-01-15', updated_at: '2025-05-20' },
  { id: '3', user_id: '9', saisons: '2025', etat: 'in_progress', created_at: '2025-01-15', updated_at: '2025-04-10' },
  { id: '4', user_id: '10', saisons: '2025', etat: 'validated', created_at: '2025-01-15', updated_at: '2025-06-01' },
  { id: '5', user_id: '11', saisons: '2025', etat: 'draft', created_at: '2025-01-15', updated_at: '2025-02-01' },
]

// ============ COMPETENCES ============
export const competences: Competence[] = [
  { id: '1', fiches_id: '1', question_competence_id: '1', type: 'know_how', intitule: 'React Development', auto_eval: 8, hierarchie_eval: 7, etat: 'validated', created_at: '2025-01-15', updated_at: '2025-06-15' },
  { id: '2', fiches_id: '1', question_competence_id: '2', type: 'soft_skills', intitule: 'Team Collaboration', auto_eval: 7, hierarchie_eval: 8, etat: 'validated', created_at: '2025-01-15', updated_at: '2025-06-15' },
  { id: '3', fiches_id: '2', question_competence_id: '1', type: 'know_how', intitule: 'Python Programming', auto_eval: 9, hierarchie_eval: 8, etat: 'validated', created_at: '2025-01-15', updated_at: '2025-05-20' },
  { id: '4', fiches_id: '2', question_competence_id: '3', type: 'knowledge', intitule: 'Data Analysis', auto_eval: 7, hierarchie_eval: 7, etat: 'validated', created_at: '2025-01-15', updated_at: '2025-05-20' },
  { id: '5', fiches_id: '3', question_competence_id: '5', type: 'knowledge', intitule: 'Risk Assessment', auto_eval: 6, hierarchie_eval: 5, etat: 'submitted', created_at: '2025-01-15', updated_at: '2025-04-10' },
  { id: '6', fiches_id: '4', question_competence_id: '5', type: 'knowledge', intitule: 'Insurance Regulations', auto_eval: 8, hierarchie_eval: 9, etat: 'validated', created_at: '2025-01-15', updated_at: '2025-06-01' },
  { id: '7', fiches_id: '4', question_competence_id: '2', type: 'soft_skills', intitule: 'Client Communication', auto_eval: 9, hierarchie_eval: 8, etat: 'validated', created_at: '2025-01-15', updated_at: '2025-06-01' },
]

// ============ ACTIVITIES ============
export const activities: Activity[] = [
  {
    id: '1', title: 'Formation React Advanced', description: 'Formation avancee en React.js incluant hooks, context API, et patterns avances pour le developpement frontend.', type: 'training',
    required_skills: [
      { skill_name: 'React Development', type: 'know_how', desired_level: 'high', weight: 0.4 },
      { skill_name: 'JavaScript', type: 'know_how', desired_level: 'medium', weight: 0.3 },
      { skill_name: 'Team Collaboration', type: 'soft_skills', desired_level: 'medium', weight: 0.3 },
    ],
    seats: 5, date: '2026-03-15', duration: '3 jours', location: 'Siege Tunis', priority: 'consolidate_medium', status: 'open', created_by: '3', assigned_manager: '2', created_at: '2026-01-10', updated_at: '2026-01-10'
  },
  {
    id: '2', title: 'Certification ISO 27001', description: 'Certification en securite de l\'information selon la norme ISO 27001 pour les equipes techniques.', type: 'certification',
    required_skills: [
      { skill_name: 'Information Security', type: 'knowledge', desired_level: 'expert', weight: 0.5 },
      { skill_name: 'Risk Assessment', type: 'knowledge', desired_level: 'high', weight: 0.3 },
      { skill_name: 'Documentation', type: 'know_how', desired_level: 'medium', weight: 0.2 },
    ],
    seats: 3, date: '2026-04-20', duration: '5 jours', location: 'Centre Formation Lac', priority: 'exploit_expert', status: 'open', created_by: '3', assigned_manager: '2', created_at: '2026-01-15', updated_at: '2026-01-15'
  },
  {
    id: '3', title: 'Audit Interne Qualite', description: 'Mission d\'audit interne pour evaluer les processus qualite de la branche assurance automobile.', type: 'audit',
    required_skills: [
      { skill_name: 'Insurance Regulations', type: 'knowledge', desired_level: 'high', weight: 0.4 },
      { skill_name: 'Analytical Thinking', type: 'soft_skills', desired_level: 'high', weight: 0.3 },
      { skill_name: 'Report Writing', type: 'know_how', desired_level: 'medium', weight: 0.3 },
    ],
    seats: 4, date: '2026-05-10', duration: '2 semaines', location: 'Agence Sousse', priority: 'develop_low', status: 'in_progress', created_by: '3', assigned_manager: '6', created_at: '2026-02-01', updated_at: '2026-02-01'
  },
  {
    id: '4', title: 'Projet Digitalisation Sinistres', description: 'Projet de digitalisation du processus de gestion des sinistres pour ameliorer l\'experience client.', type: 'project',
    required_skills: [
      { skill_name: 'Project Management', type: 'know_how', desired_level: 'high', weight: 0.3 },
      { skill_name: 'Client Communication', type: 'soft_skills', desired_level: 'high', weight: 0.3 },
      { skill_name: 'Insurance Knowledge', type: 'knowledge', desired_level: 'medium', weight: 0.4 },
    ],
    seats: 6, date: '2026-06-01', duration: '3 mois', location: 'Siege Tunis', priority: 'consolidate_medium', status: 'draft', created_by: '3', created_at: '2026-02-10', updated_at: '2026-02-10'
  },
  {
    id: '5', title: 'Mission Evaluation Agences', description: 'Mission d\'evaluation des agences regionales pour optimiser les performances commerciales.', type: 'mission',
    required_skills: [
      { skill_name: 'Sales Knowledge', type: 'knowledge', desired_level: 'high', weight: 0.4 },
      { skill_name: 'Leadership', type: 'soft_skills', desired_level: 'expert', weight: 0.3 },
      { skill_name: 'Data Analysis', type: 'know_how', desired_level: 'medium', weight: 0.3 },
    ],
    seats: 2, date: '2026-03-25', duration: '1 semaine', location: 'Agences Regionales', priority: 'exploit_expert', status: 'completed', created_by: '3', assigned_manager: '5', created_at: '2025-12-15', updated_at: '2026-02-01'
  },
]

// ============ RECOMMENDATIONS ============
export const recommendations: Recommendation[] = [
  { id: '1', activity_id: '1', employee_id: '4', employee_name: 'Ahmed Khelifi', employee_department: 'Direction Technique', global_score: 87, skills_match: [{ skill_name: 'React Development', employee_score: 7.5, required_score: 8, match_percentage: 94 }, { skill_name: 'JavaScript', employee_score: 8, required_score: 6, match_percentage: 100 }, { skill_name: 'Team Collaboration', employee_score: 7.5, required_score: 6, match_percentage: 100 }], match_percentage: 92, experience_score: 78, progression_score: 85, priority_fit: 'Bon profil pour consolidation niveau medium', justification: 'Profil technique solide avec une bonne progression en React. Ideal pour consolider ses competences.', status: 'recommended' },
  { id: '2', activity_id: '1', employee_id: '8', employee_name: 'Youssef Dridi', employee_department: 'Direction Technique', global_score: 82, skills_match: [{ skill_name: 'React Development', employee_score: 6, required_score: 8, match_percentage: 75 }, { skill_name: 'JavaScript', employee_score: 7, required_score: 6, match_percentage: 100 }, { skill_name: 'Team Collaboration', employee_score: 8, required_score: 6, match_percentage: 100 }], match_percentage: 85, experience_score: 65, progression_score: 90, priority_fit: 'Forte progression recente', justification: 'Progression rapide en developpement. La formation consoliderait ses acquis.', status: 'recommended' },
  { id: '3', activity_id: '1', employee_id: '12', employee_name: 'Rami Mejri', employee_department: 'Direction Technique', global_score: 79, skills_match: [{ skill_name: 'React Development', employee_score: 5, required_score: 8, match_percentage: 63 }, { skill_name: 'JavaScript', employee_score: 7.5, required_score: 6, match_percentage: 100 }, { skill_name: 'Team Collaboration', employee_score: 7, required_score: 6, match_percentage: 100 }], match_percentage: 78, experience_score: 82, progression_score: 70, priority_fit: 'Besoin de montee en competence React', justification: 'Experience solide mais besoin de mise a jour sur React moderne.', status: 'confirmed' },
  { id: '4', activity_id: '2', employee_id: '4', employee_name: 'Ahmed Khelifi', employee_department: 'Direction Technique', global_score: 72, skills_match: [{ skill_name: 'Information Security', employee_score: 6, required_score: 9, match_percentage: 67 }, { skill_name: 'Risk Assessment', employee_score: 5, required_score: 7, match_percentage: 71 }], match_percentage: 69, experience_score: 70, progression_score: 75, priority_fit: 'Profil technique a developper en securite', justification: 'Bon potentiel technique. La certification renforcerait le profil.', status: 'accepted' },
  { id: '5', activity_id: '3', employee_id: '10', employee_name: 'Karim Bouaziz', employee_department: 'Assurance Automobile', global_score: 91, skills_match: [{ skill_name: 'Insurance Regulations', employee_score: 8.5, required_score: 8, match_percentage: 100 }, { skill_name: 'Analytical Thinking', employee_score: 7, required_score: 7, match_percentage: 100 }], match_percentage: 95, experience_score: 88, progression_score: 82, priority_fit: 'Expert assurance, ideal pour audit', justification: 'Profil expert en assurance automobile avec excellente connaissance reglementaire.', status: 'confirmed' },
]

// ============ NOTIFICATIONS ============
export const notifications: Notification[] = [
  { id: '1', user_id: '4', title: 'Nouvelle activite proposee', message: 'Vous avez ete recommande pour la Formation React Advanced', type: 'activity_assigned', read: false, activity_id: '1', created_at: '2026-02-15T10:30:00' },
  { id: '2', user_id: '4', title: 'Certification disponible', message: 'Vous avez ete selectionne pour la Certification ISO 27001', type: 'activity_assigned', read: false, activity_id: '2', created_at: '2026-02-14T14:00:00' },
  { id: '3', user_id: '2', title: 'Recommandations pretes', message: 'Les recommandations AI pour Formation React Advanced sont disponibles', type: 'recommendation', read: true, activity_id: '1', created_at: '2026-02-13T09:00:00' },
  { id: '4', user_id: '3', title: 'Activite validee', message: 'L\'activite Audit Interne Qualite a ete validee par le manager', type: 'participation_confirmed', read: true, activity_id: '3', created_at: '2026-02-12T16:45:00' },
  { id: '5', user_id: '8', title: 'Formation recommandee', message: 'Vous avez ete recommande pour la Formation React Advanced', type: 'activity_assigned', read: false, activity_id: '1', created_at: '2026-02-15T10:30:00' },
  { id: '6', user_id: '10', title: 'Mission audit confirmee', message: 'Votre participation a l\'Audit Interne Qualite a ete confirmee', type: 'participation_confirmed', read: false, activity_id: '3', created_at: '2026-02-14T11:00:00' },
]

// ============ ANALYTICS ============
export const departmentSkillStats: DepartmentSkillStats[] = [
  { department: 'Direction Technique', knowledge: 72, know_how: 85, soft_skills: 68 },
  { department: 'Ressources Humaines', knowledge: 65, know_how: 70, soft_skills: 88 },
  { department: 'Finance', knowledge: 78, know_how: 72, soft_skills: 65 },
  { department: 'Assurance Auto', knowledge: 82, know_how: 75, soft_skills: 70 },
  { department: 'Assurance Vie', knowledge: 80, know_how: 68, soft_skills: 75 },
]

export const skillGaps: SkillGap[] = [
  { skill: 'React Development', current: 65, required: 85, gap: 20 },
  { skill: 'Information Security', current: 45, required: 80, gap: 35 },
  { skill: 'Project Management', current: 70, required: 85, gap: 15 },
  { skill: 'Data Analysis', current: 55, required: 75, gap: 20 },
  { skill: 'Client Communication', current: 72, required: 90, gap: 18 },
  { skill: 'Risk Assessment', current: 60, required: 80, gap: 20 },
]

export const progressionData: ProgressionData[] = [
  { month: 'Sep', score: 58 },
  { month: 'Oct', score: 62 },
  { month: 'Nov', score: 65 },
  { month: 'Dec', score: 68 },
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 76 },
]

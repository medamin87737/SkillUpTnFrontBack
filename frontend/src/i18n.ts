import type { Language } from './context/AccessibilityContext'

type Messages = Record<string, string>

const fr: Messages = {
  // Generic
  'app.name': 'SkillUpTn',
  'app.tagline': 'Systeme intelligent de recommandation des employes',

  // Login hero
  'login.heroTitle': 'Systeme Intelligent de Recommandation des Employes',
  'login.heroBody':
    'Optimisez la gestion des competences et la recommandation des employes grace a l\'intelligence artificielle.',
  'login.heroPills': 'Recommandation • Analytics • Gestion des competences',

  // Header
  'header.searchPlaceholder': 'Rechercher...',
  'header.notifications': 'Notifications',
  'header.noNotifications': 'Aucune notification',

  // Sidebar common
  'sidebar.logoSubtitle': 'Recommendation System',

  // Sidebar ADMIN
  'sidebar.admin.dashboard': 'Dashboard',
  'sidebar.admin.users': 'Utilisateurs',
  'sidebar.admin.departments': 'Departements',
  'sidebar.admin.skills': 'Competences',
  'sidebar.admin.questions': 'Questions',
  'sidebar.admin.analytics': 'Analytiques',

  // Sidebar HR
  'sidebar.hr.dashboard': 'Dashboard',
  'sidebar.hr.activities': 'Activites',
  'sidebar.hr.createActivity': 'Creer Activite',
  'sidebar.hr.history': 'Historique',
  'sidebar.hr.analytics': 'Analytiques',

  // Sidebar MANAGER
  'sidebar.manager.dashboard': 'Dashboard',
  'sidebar.manager.activities': 'Activites',
  'sidebar.manager.validations': 'Validations',
  'sidebar.manager.history': 'Historique',

  // Sidebar EMPLOYEE
  'sidebar.employee.dashboard': 'Dashboard',
  'sidebar.employee.activities': 'Mes Activites',
  'sidebar.employee.notifications': 'Notifications',
  'sidebar.employee.history': 'Historique',
  'sidebar.employee.profile': 'Mon Profil',

  // Login page
  'login.title': 'Connexion',
  'login.subtitle': 'Accedez a votre espace de travail',
  'login.email': 'Email',
  'login.emailPlaceholder': 'votre.email@skillup.tn',
  'login.password': 'Mot de passe',
  'login.passwordPlaceholder': 'Votre mot de passe',
  'login.submit': 'Se connecter',
  'login.errorMissingEmail': 'Veuillez saisir votre email',
  'login.errorMissingPassword': 'Veuillez saisir votre mot de passe',
  'login.errorLogin': 'Email ou mot de passe incorrect',
  'login.errorRole': 'Impossible de determiner votre role utilisateur',
}

const en: Messages = {
  // Generic
  'app.name': 'SkillUpTn',
  'app.tagline': 'Intelligent Employee Recommendation System',

  // Login hero
  'login.heroTitle': 'Intelligent Employee Recommendation System',
  'login.heroBody':
    'Optimize skills management and employee recommendations powered by artificial intelligence.',
  'login.heroPills': 'Recommendation • Analytics • Skills management',

  // Header
  'header.searchPlaceholder': 'Search...',
  'header.notifications': 'Notifications',
  'header.noNotifications': 'No notifications',

  // Sidebar common
  'sidebar.logoSubtitle': 'Recommendation System',

  // Sidebar ADMIN
  'sidebar.admin.dashboard': 'Dashboard',
  'sidebar.admin.users': 'Users',
  'sidebar.admin.departments': 'Departments',
  'sidebar.admin.skills': 'Skills',
  'sidebar.admin.questions': 'Questions',
  'sidebar.admin.analytics': 'Analytics',

  // Sidebar HR
  'sidebar.hr.dashboard': 'Dashboard',
  'sidebar.hr.activities': 'Activities',
  'sidebar.hr.createActivity': 'Create Activity',
  'sidebar.hr.history': 'History',
  'sidebar.hr.analytics': 'Analytics',

  // Sidebar MANAGER
  'sidebar.manager.dashboard': 'Dashboard',
  'sidebar.manager.activities': 'Activities',
  'sidebar.manager.validations': 'Approvals',
  'sidebar.manager.history': 'History',

  // Sidebar EMPLOYEE
  'sidebar.employee.dashboard': 'Dashboard',
  'sidebar.employee.activities': 'My Activities',
  'sidebar.employee.notifications': 'Notifications',
  'sidebar.employee.history': 'History',
  'sidebar.employee.profile': 'My Profile',

  // Login page
  'login.title': 'Sign in',
  'login.subtitle': 'Access your workspace',
  'login.email': 'Email',
  'login.emailPlaceholder': 'your.email@skillup.tn',
  'login.password': 'Password',
  'login.passwordPlaceholder': 'Your password',
  'login.submit': 'Sign in',
  'login.errorMissingEmail': 'Please enter your email',
  'login.errorMissingPassword': 'Please enter your password',
  'login.errorLogin': 'Incorrect email or password',
  'login.errorRole': 'Unable to determine your user role',
}

const messages: Record<Language, Messages> = { fr, en }

export function t(lang: Language, key: string): string {
  return messages[lang]?.[key] ?? messages.fr[key] ?? key
}


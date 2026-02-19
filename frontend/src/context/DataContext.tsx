import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, Department, Activity, Recommendation, Notification, QuestionCompetence, UserStatus } from '../types'
import { useAuth } from './AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface DataContextType {
  users: User[]
  departments: Department[]
  activities: Activity[]
  recommendations: Recommendation[]
  notifications: Notification[]
  questionCompetences: QuestionCompetence[]
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (id: string) => void
  addDepartment: (dept: Department) => void
  updateDepartment: (dept: Department) => void
  deleteDepartment: (id: string) => void
  addActivity: (activity: Activity) => void
  updateActivity: (activity: Activity) => void
  deleteActivity: (id: string) => void
  updateRecommendation: (rec: Recommendation) => void
  markNotificationRead: (id: string) => void
  getUnreadCount: (userId: string) => number
  getUserNotifications: (userId: string) => Notification[]
  getActivityRecommendations: (activityId: string) => Recommendation[]
  getDepartmentName: (id: string) => string
}

const DataContext = createContext<DataContextType | undefined>(undefined)

function mapBackendStatusToFrontend(status: string | undefined): UserStatus {
  switch (status) {
    case 'ACTIVE':
      return 'active'
    case 'INACTIVE':
      return 'inactive'
    case 'SUSPENDED':
      return 'suspended'
    default:
      return 'active'
  }
}

function mapFrontendStatusToBackend(status: UserStatus | undefined): string | undefined {
  switch (status) {
    case 'active':
      return 'ACTIVE'
    case 'inactive':
      return 'INACTIVE'
    case 'suspended':
      return 'SUSPENDED'
    default:
      return undefined
  }
}

function mapBackendUserToUi(backendUser: any): User {
  return {
    id: String(backendUser._id ?? backendUser.id ?? ''),
    name: backendUser.name ?? '',
    matricule: backendUser.matricule ?? '',
    telephone: backendUser.telephone ?? '',
    email: backendUser.email ?? '',
    // Never expose real password on frontend
    password: '',
    date_embauche:
      typeof backendUser.date_embauche === 'string'
        ? backendUser.date_embauche
        : backendUser.date_embauche
          ? new Date(backendUser.date_embauche).toISOString()
          : new Date().toISOString(),
    departement_id: backendUser.department_id ? String(backendUser.department_id) : '',
    manager_id: backendUser.manager_id ? String(backendUser.manager_id) : null,
    status: mapBackendStatusToFrontend(backendUser.status),
    en_ligne: backendUser.en_ligne ?? false,
    role: backendUser.role,
    avatar: backendUser.avatar,
  }
}

function mapBackendActivityToUi(a: any): Activity {
  return {
    id: a?._id?.toString() ?? a?.id ?? crypto.randomUUID(),
    title: a?.title ?? '',
    description: a?.description ?? '',
    type: a?.type ?? 'training',
    required_skills: (a?.requiredSkills ?? []).map((s: any) => ({
      skill_name: s?.skill_name ?? '',
      desired_level: s?.desired_level ?? 'medium',
    })),
    seats: a?.maxParticipants ?? 0,
    date: a?.startDate ? new Date(a.startDate).toISOString() : new Date().toISOString(),
    duration: a?.duration ?? 'N/A',
    location: a?.location ?? 'N/A',
    priority: a?.priority ?? 'consolidate_medium',
    status: a?.status ?? 'open',
    created_by: a?.created_by ?? 'HR',
    assigned_manager: a?.assigned_manager,
    created_at: a?.createdAt ?? new Date().toISOString(),
    updated_at: a?.updatedAt ?? new Date().toISOString(),
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [questionCompetences] = useState<QuestionCompetence[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Activities (currently public endpoint)
    fetch(`${API_BASE_URL}/activities`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setActivities(data.map(mapBackendActivityToUi)))
      .catch(err => console.error('Erreur fetch activités:', err))

    // Users (restricted to HR / ADMIN by backend)
    const token = sessionStorage.getItem('auth_token')
    if (token) {
      fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Erreur fetch utilisateurs: ${res.status}`)
          }
          return res.json()
        })
        .then(payload => {
          const data = Array.isArray(payload.data) ? payload.data : payload
          setUsers(data.map(mapBackendUserToUi))
        })
        .catch(err => console.error('Erreur fetch utilisateurs:', err))
    }
  }, [])

  const addActivity = useCallback((a: Activity) => setActivities(prev => [a, ...prev]), [])
  const updateActivity = useCallback((a: Activity) => setActivities(prev => prev.map(x => x.id === a.id ? a : x)), [])
  const deleteActivity = useCallback((id: string) => setActivities(prev => prev.filter(x => x.id !== id)), [])

  const addUser = useCallback((u: User) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) return

    ;(async () => {
      try {
        const payload = {
          name: u.name,
          matricule: u.matricule,
          telephone: u.telephone,
          email: u.email,
          // Default initial password that respects backend validation rules
          password: 'Password123!',
          date_embauche: u.date_embauche,
          role: u.role,
          status: mapFrontendStatusToBackend(u.status),
        }

        const res = await fetch(`${API_BASE_URL}/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          console.error('Erreur création utilisateur:', await res.text())
          return
        }

        const data = await res.json()
        const backendUser = data.user ?? data
        const mapped = mapBackendUserToUi(backendUser)
        setUsers(prev => [mapped, ...prev])
      } catch (err) {
        console.error('Erreur addUser:', err)
      }
    })()
  }, [])

  const updateUser = useCallback((u: User) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) return

    ;(async () => {
      try {
        const payload: any = {
          name: u.name,
          matricule: u.matricule,
          telephone: u.telephone,
          email: u.email,
          date_embauche: u.date_embauche,
          role: u.role,
          status: mapFrontendStatusToBackend(u.status),
          en_ligne: u.en_ligne,
        }

        const res = await fetch(`${API_BASE_URL}/users/${u.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          console.error('Erreur mise à jour utilisateur:', await res.text())
          return
        }

        const data = await res.json()
        const backendUser = data.user ?? data
        const mapped = mapBackendUserToUi(backendUser)
        setUsers(prev => prev.map(x => (x.id === mapped.id ? mapped : x)))
      } catch (err) {
        console.error('Erreur updateUser:', err)
      }
    })()
  }, [])

  const deleteUser = useCallback((id: string) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) return

    ;(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          console.error('Erreur suppression utilisateur:', await res.text())
          return
        }

        setUsers(prev => prev.filter(u => u.id !== id))
      } catch (err) {
        console.error('Erreur deleteUser:', err)
      }
    })()
  }, [])

  return (
    <DataContext.Provider value={{
      users, departments, activities, recommendations, notifications, questionCompetences,
      addUser, updateUser, deleteUser,
      addDepartment: () => {}, updateDepartment: () => {}, deleteDepartment: () => {},
      addActivity, updateActivity, deleteActivity,
      updateRecommendation: () => {},
      markNotificationRead: () => {},
      getUnreadCount: () => 0,
      getUserNotifications: () => [],
      getActivityRecommendations: () => [],
      getDepartmentName: () => 'N/A',
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within a DataProvider')
  return context
}

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, UserRole, UserStatus } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const mapBackendStatusToFrontend = (status: string | undefined): UserStatus => {
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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      const backendUser = data.user as any
      const token = data.token as string | undefined

      if (!backendUser) {
        return false
      }

      const mappedUser: User = {
        id: String(backendUser._id ?? backendUser.id ?? ''),
        name: backendUser.name ?? '',
        matricule: backendUser.matricule ?? '',
        telephone: backendUser.telephone ?? '',
        email: backendUser.email ?? email,
        // Never store backend password hash in the frontend
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
        en_ligne: backendUser.en_ligne ?? true,
        role: backendUser.role as UserRole,
      }

      setUser(mappedUser)
      sessionStorage.setItem('auth_user', JSON.stringify(mappedUser))

      if (token) {
        sessionStorage.setItem('auth_token', token)
      }

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('auth_user')
    sessionStorage.removeItem('auth_token')
  }, [])

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import type { UserRole } from '../types'
import { useAccessibility } from '../context/AccessibilityContext'
import { useI18n } from '../hooks/useI18n'

const roleRoutes: Record<UserRole, string> = {
  ADMIN: '/admin/dashboard',
  HR: '/hr/dashboard',
  MANAGER: '/manager/dashboard',
  EMPLOYEE: '/employee/dashboard',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const { language } = useAccessibility()
  const navigate = useNavigate()

  const t = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) { setError(t('errorMissingEmail')); return }
    if (!password) { setError(t('errorMissingPassword')); return }

    setLoading(true)
    const success = await login(email, password)
    setLoading(false)

    if (success) {
      const finalUser = user ?? JSON.parse(sessionStorage.getItem('auth_user') || '{}')
      if (finalUser && finalUser.role) {
        navigate(roleRoutes[finalUser.role as UserRole] || '/login')
      } else {
        setError(t('errorRole'))
      }
    } else {
      setError(t('errorLogin'))
    }
  }

  const normalizeSpokenEmail = (input: string) => {
    let value = input.trim().toLowerCase()
    value = value
      .replace(/\bat\b/g, '@')
      .replace(/\barobase\b/g, '@')
      .replace(/\bpoint\b/g, '.')
      .replace(/\bdot\b/g, '.')
      .replace(/\s+/g, '')
    return value
  }

  // Voice commands: email / password dictation + submit
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | { type?: string; value?: string; command?: string }
        | undefined
      if (!detail) return

      if (detail.type === 'submit') {
        const form = document.querySelector<HTMLFormElement>('[data-accessibility-login="true"]')
        form?.requestSubmit()
        return
      }

      if (detail.type === 'email' && detail.value) {
        setEmail((prev) => (prev ? prev : normalizeSpokenEmail(detail.value!)))
        return
      }

      if (detail.type === 'password' && detail.value) {
        setPassword((prev) => (prev ? prev : detail.value!))
      }
    }

    window.addEventListener('skillup-voice-command', handler as EventListener)
    return () => window.removeEventListener('skillup-voice-command', handler as EventListener)
  }, [])

  return (
    <div className="flex min-h-screen">
      {/* Left - Branding / Hero */}
      <div className="relative hidden flex-1 items-center justify-center bg-[#0B3B8A] px-12 py-16 text-white lg:flex overflow-hidden">
        {/* Background circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/8" />
          <div className="absolute -bottom-32 right-[-80px] h-80 w-80 rounded-full bg-white/4" />
        </div>

        <div className="relative z-10 max-w-xl">
          {/* Logo + app name */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF7A1A] text-3xl font-bold text-white shadow-xl">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="13 3 7 14 11 14 9 21 17 9 13 9 15 3" />
              </svg>
            </div>
            <span className="text-3xl font-bold tracking-wide">SkillUpTn</span>
          </div>

          <h2 className="mb-4 text-2xl font-semibold">
            {t('login.heroTitle')}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-white/85">
            {t('login.heroBody')}
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">
            {t('login.heroPills')}
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-8 lg:px-8">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl border border-border">
          {/* Logo compact dans la carte */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
              {/* Remplacez ce SVG par une image si vous avez un vrai logo, par ex.:
                  <img src=\"/logo.svg\" alt=\"SkillUpTn\" className=\"h-8 w-8\" /> */}
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="13 3 7 14 11 14 9 21 17 9 13 9 15 3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">{t('app.name')}</span>
              <span className="text-xs text-muted-foreground">
                {t('app.tagline')}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-accessibility-login="true">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">{t('email')}</label>
              <input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">{t('password')}</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  {t('submit')}
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}

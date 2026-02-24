import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/shared/StatCard'
import StatusBadge from '../../components/shared/StatusBadge'
import { ClipboardList, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { useI18n } from '../../hooks/useI18n'

export default function ManagerDashboard() {
  const { activities, recommendations, users, getUnreadCount } = useData()
  const { user } = useAuth()
  const t = useI18n()

  const myActivities = activities.filter(a => a.assigned_manager === user?.id)
  const pendingValidations = myActivities.filter(a => a.status === 'in_progress' || a.status === 'open')
  const myTeam = users.filter(u => u.manager_id === user?.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.manager.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('dashboard.manager.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t('dashboard.manager.card.myActivities')} value={myActivities.length} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard title={t('dashboard.manager.card.pendingValidations')} value={pendingValidations.length} icon={<Clock className="h-5 w-5" />} />
        <StatCard title={t('dashboard.manager.card.myTeam')} value={myTeam.length} icon={<Users className="h-5 w-5" />} />
        <StatCard title={t('dashboard.manager.card.notifications')} value={user ? getUnreadCount(user.id) : 0} icon={<CheckCircle className="h-5 w-5" />} />
      </div>

      {/* Team members */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-card-foreground">{t('dashboard.manager.section.myTeam')}</h3>
        </div>
        <div className="divide-y divide-border">
          {myTeam.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm text-muted-foreground">{t('dashboard.manager.section.noTeam')}</p>
          ) : (
            myTeam.map(member => (
              <div key={member.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${member.en_ligne ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <StatusBadge status={member.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activities assigned to me */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-card-foreground">{t('dashboard.manager.section.assignedActivities')}</h3>
          <Link to="/manager/activities" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {t('dashboard.manager.section.viewAll')} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {myActivities.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm text-muted-foreground">{t('dashboard.manager.section.noAssignedActivities')}</p>
          ) : (
            myActivities.map(a => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-card-foreground">{a.title}</span>
                  <span className="text-xs text-muted-foreground">{a.date} - {a.seats} places</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.status} />
                  <Link to={`/manager/activity/${a.id}`} className="text-xs font-medium text-primary hover:underline">Voir</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

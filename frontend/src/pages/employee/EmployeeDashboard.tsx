import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/shared/StatCard'
import StatusBadge from '../../components/shared/StatusBadge'
import { ClipboardList, Bell, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { progressionData, competences, fiches } from '../../data/mock-data'

export default function EmployeeDashboard() {
  const { recommendations, getUnreadCount, getUserNotifications } = useData()
  const { user } = useAuth()

  const myRecs = recommendations.filter(r => r.employee_id === user?.id)
  const accepted = myRecs.filter(r => r.status === 'accepted' || r.status === 'confirmed')
  const pending = myRecs.filter(r => r.status === 'recommended')
  const unread = user ? getUnreadCount(user.id) : 0
  const recentNotifs = user ? getUserNotifications(user.id).slice(0, 3) : []

  // Get user's competences
  const userFiches = fiches.filter(f => f.user_id === user?.id)
  const userCompetences = competences.filter(c => userFiches.some(f => f.id === c.fiches_id))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon Espace</h1>
        <p className="text-sm text-muted-foreground">Bienvenue, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Activites proposees" value={myRecs.length} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard title="Participations" value={accepted.length} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard title="En attente" value={pending.length} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Notifications" value={unread} icon={<Bell className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* My skills */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Mes competences</h3>
          {userCompetences.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Aucune competence evaluee</p>
          ) : (
            <div className="flex flex-col gap-3">
              {userCompetences.map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-card-foreground">{c.intitule}</span>
                    <StatusBadge status={c.type} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">Auto</span>
                        <div className="h-1.5 w-20 rounded-full bg-muted">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(c.auto_eval / 10) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{c.auto_eval}/10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">Mgr</span>
                        <div className="h-1.5 w-20 rounded-full bg-muted">
                          <div className="h-1.5 rounded-full bg-secondary" style={{ width: `${(c.hierarchie_eval / 10) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{c.hierarchie_eval}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progression chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Ma progression</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="score" stroke="hsl(27, 92%, 54%)" strokeWidth={2} dot={{ fill: 'hsl(27, 92%, 54%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent notifications */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-card-foreground">Notifications recentes</h3>
          <Link to="/employee/notifications" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentNotifs.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm text-muted-foreground">Aucune notification</p>
          ) : (
            recentNotifs.map(n => (
              <div key={n.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-card-foreground">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.message}</span>
                </div>
                {!n.read && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

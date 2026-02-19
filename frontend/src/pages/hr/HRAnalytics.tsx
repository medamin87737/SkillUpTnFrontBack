import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useData } from '../../context/DataContext'
import StatCard from '../../components/shared/StatCard'
import { skillGaps, progressionData } from '../../data/mock-data'
import { TrendingUp, Target, ClipboardList, CheckCircle } from 'lucide-react'

const COLORS = ['hsl(27, 92%, 54%)', 'hsl(222, 60%, 33%)', 'hsl(160, 60%, 45%)', 'hsl(43, 74%, 66%)', 'hsl(340, 75%, 55%)']

export default function HRAnalytics() {
  const { activities, recommendations } = useData()

  const activityByType = [
    { name: 'Formation', value: activities.filter(a => a.type === 'training').length },
    { name: 'Certification', value: activities.filter(a => a.type === 'certification').length },
    { name: 'Projet', value: activities.filter(a => a.type === 'project').length },
    { name: 'Mission', value: activities.filter(a => a.type === 'mission').length },
    { name: 'Audit', value: activities.filter(a => a.type === 'audit').length },
  ].filter(a => a.value > 0)

  const recByStatus = [
    { name: 'Recommande', value: recommendations.filter(r => r.status === 'recommended').length },
    { name: 'Confirme', value: recommendations.filter(r => r.status === 'confirmed').length },
    { name: 'Accepte', value: recommendations.filter(r => r.status === 'accepted').length },
    { name: 'Rejete', value: recommendations.filter(r => r.status === 'rejected').length },
    { name: 'Decline', value: recommendations.filter(r => r.status === 'declined').length },
  ].filter(r => r.value > 0)

  const avgScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((s, r) => s + r.global_score, 0) / recommendations.length)
    : 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytiques RH</h1>
        <p className="text-sm text-muted-foreground">Suivi des activites et performance des recommandations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total activites" value={activities.length} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard title="Recommandations" value={recommendations.length} icon={<Target className="h-5 w-5" />} />
        <StatCard title="Score moyen" value={`${avgScore}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Taux confirmation" value={`${recommendations.length > 0 ? Math.round((recommendations.filter(r => r.status === 'confirmed' || r.status === 'accepted').length / recommendations.length) * 100) : 0}%`} icon={<CheckCircle className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity types */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Activites par type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={activityByType} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value">
                {activityByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {activityByType.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation status */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Statut des recommandations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={recByStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value">
                {recByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {recByStatus.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progression */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Progression globale</h3>
          <ResponsiveContainer width="100%" height={220}>
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

      {/* Skill Gaps */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Ecarts de competences prioritaires</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={skillGaps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
            <XAxis dataKey="skill" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
            <Bar dataKey="current" name="Actuel" fill="hsl(27, 92%, 54%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="required" name="Requis" fill="hsl(222, 60%, 33%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

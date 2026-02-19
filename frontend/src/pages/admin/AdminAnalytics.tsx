import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { useData } from '../../context/DataContext'
import StatCard from '../../components/shared/StatCard'
import { departmentSkillStats, skillGaps, progressionData } from '../../data/mock-data'
import { TrendingUp, Target, Users, Brain } from 'lucide-react'

export default function AdminAnalytics() {
  const { users, activities, recommendations } = useData()

  const avgScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((s, r) => s + r.global_score, 0) / recommendations.length)
    : 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytiques</h1>
        <p className="text-sm text-muted-foreground">Vue analytique complete du systeme de recommandation</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Score moyen" value={`${avgScore}%`} icon={<TrendingUp className="h-5 w-5" />} trend={{ value: 4, label: 'vs dernier trimestre' }} />
        <StatCard title="Ecarts identifies" value={skillGaps.length} icon={<Target className="h-5 w-5" />} />
        <StatCard title="Employes evalues" value={users.filter(u => u.role === 'EMPLOYEE').length} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Activites actives" value={activities.filter(a => a.status !== 'cancelled' && a.status !== 'draft').length} icon={<Brain className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Skill gaps */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Ecarts de competences (Gap Analysis)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillGaps} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 10 }} width={120} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
              <Bar dataKey="current" name="Niveau actuel" fill="hsl(27, 92%, 54%)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="required" name="Niveau requis" fill="hsl(222, 60%, 33%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Profil competences par departement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={departmentSkillStats}>
              <PolarGrid stroke="hsl(220, 13%, 89%)" />
              <PolarAngleAxis dataKey="department" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(' ')[0]} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Savoir" dataKey="knowledge" stroke="hsl(27, 92%, 54%)" fill="hsl(27, 92%, 54%)" fillOpacity={0.2} />
              <Radar name="Savoir-faire" dataKey="know_how" stroke="hsl(222, 60%, 33%)" fill="hsl(222, 60%, 33%)" fillOpacity={0.2} />
              <Radar name="Savoir-etre" dataKey="soft_skills" stroke="hsl(160, 60%, 45%)" fill="hsl(160, 60%, 45%)" fillOpacity={0.2} />
              <Legend />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gap detail cards */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Detail des ecarts prioritaires</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillGaps.sort((a, b) => b.gap - a.gap).map(g => (
            <div key={g.skill} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground">{g.skill}</span>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">-{g.gap}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Actuel</span>
                  <span>{g.current}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${g.current}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Requis</span>
                  <span>{g.required}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-secondary" style={{ width: `${g.required}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

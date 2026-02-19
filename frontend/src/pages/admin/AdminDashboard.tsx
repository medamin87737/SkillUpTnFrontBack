import { Users, Building2, ClipboardList, Brain, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useData } from '../../context/DataContext'
import StatCard from '../../components/shared/StatCard'
import { departmentSkillStats, progressionData } from '../../data/mock-data'

const COLORS = ['hsl(27, 92%, 54%)', 'hsl(222, 60%, 33%)', 'hsl(160, 60%, 45%)', 'hsl(43, 74%, 66%)', 'hsl(340, 75%, 55%)']

export default function AdminDashboard() {
  const { users, departments, activities } = useData()

  const roleDistribution = [
    { name: 'Employes', value: users.filter(u => u.role === 'EMPLOYEE').length },
    { name: 'Managers', value: users.filter(u => u.role === 'MANAGER').length },
    { name: 'RH', value: users.filter(u => u.role === 'HR').length },
    { name: 'Admins', value: users.filter(u => u.role === 'ADMIN').length },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Administrateur</h1>
        <p className="text-sm text-muted-foreground">Vue globale du systeme de recommandation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Employes" value={users.length} icon={<Users className="h-5 w-5" />} trend={{ value: 8, label: 'ce mois' }} />
        <StatCard title="Departements" value={departments.length} icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Activites" value={activities.length} icon={<ClipboardList className="h-5 w-5" />} trend={{ value: 12, label: 'ce mois' }} />
        <StatCard title="Competences evaluees" value={45} icon={<Brain className="h-5 w-5" />} trend={{ value: 5, label: 'ce trimestre' }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Skills by department */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Competences par departement</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentSkillStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} tickFormatter={(v) => v.split(' ')[0]} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
              <Bar dataKey="knowledge" name="Savoir" fill="hsl(27, 92%, 54%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="know_how" name="Savoir-faire" fill="hsl(222, 60%, 33%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="soft_skills" name="Savoir-etre" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Role distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Repartition des roles</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {roleDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {roleDistribution.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progression line chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Progression globale des competences</h3>
        <ResponsiveContainer width="100%" height={250}>
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
  )
}

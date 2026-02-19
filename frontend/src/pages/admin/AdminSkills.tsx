import { useData } from '../../context/DataContext'
import { competences, fiches } from '../../data/mock-data'
import StatusBadge from '../../components/shared/StatusBadge'
import DataTable from '../../components/shared/DataTable'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Competence } from '../../types'

export default function AdminSkills() {
  const { users } = useData()

  const skillsByType = [
    { type: 'Savoir', count: competences.filter(c => c.type === 'knowledge').length, avg: Math.round(competences.filter(c => c.type === 'knowledge').reduce((s, c) => s + c.hierarchie_eval, 0) / Math.max(1, competences.filter(c => c.type === 'knowledge').length)) },
    { type: 'Savoir-faire', count: competences.filter(c => c.type === 'know_how').length, avg: Math.round(competences.filter(c => c.type === 'know_how').reduce((s, c) => s + c.hierarchie_eval, 0) / Math.max(1, competences.filter(c => c.type === 'know_how').length)) },
    { type: 'Savoir-etre', count: competences.filter(c => c.type === 'soft_skills').length, avg: Math.round(competences.filter(c => c.type === 'soft_skills').reduce((s, c) => s + c.hierarchie_eval, 0) / Math.max(1, competences.filter(c => c.type === 'soft_skills').length)) },
  ]

  const columns = [
    { key: 'intitule', header: 'Competence', render: (c: Competence) => <span className="font-medium">{c.intitule}</span> },
    { key: 'type', header: 'Type', render: (c: Competence) => <StatusBadge status={c.type} /> },
    {
      key: 'employee', header: 'Employe', render: (c: Competence) => {
        const fiche = fiches.find(f => f.id === c.fiches_id)
        const user = users.find(u => u.id === fiche?.user_id)
        return <span className="text-sm">{user?.name ?? 'N/A'}</span>
      }
    },
    {
      key: 'auto_eval', header: 'Auto-eval', render: (c: Competence) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-muted">
            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(c.auto_eval / 10) * 100}%` }} />
          </div>
          <span className="text-xs font-medium">{c.auto_eval}/10</span>
        </div>
      )
    },
    {
      key: 'hierarchie_eval', header: 'Eval. Hierarchie', render: (c: Competence) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-muted">
            <div className="h-1.5 rounded-full bg-secondary" style={{ width: `${(c.hierarchie_eval / 10) * 100}%` }} />
          </div>
          <span className="text-xs font-medium">{c.hierarchie_eval}/10</span>
        </div>
      )
    },
    { key: 'etat', header: 'Statut', render: (c: Competence) => <StatusBadge status={c.etat} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestion des competences</h1>
        <p className="text-sm text-muted-foreground">{competences.length} evaluations de competences</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {skillsByType.map(s => (
          <div key={s.type} className="rounded-xl border border-border bg-card p-5">
            <span className="text-sm font-medium text-muted-foreground">{s.type}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-card-foreground">{s.count}</span>
              <span className="text-sm text-muted-foreground">evaluations</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(s.avg / 10) * 100}%` }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Moy: {s.avg}/10</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Scores moyens par type de competence</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={skillsByType} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
            <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11 }} />
            <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={100} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(220, 13%, 89%)', fontSize: '12px' }} />
            <Bar dataKey="avg" name="Score moyen" fill="hsl(27, 92%, 54%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTable columns={columns} data={competences} emptyMessage="Aucune competence" />
    </div>
  )
}

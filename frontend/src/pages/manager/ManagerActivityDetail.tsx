import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { ArrowLeft, Check, X, Send, Target, TrendingUp } from 'lucide-react'
import type { Recommendation } from '../../types'

export default function ManagerActivityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activities, getActivityRecommendations, updateRecommendation } = useData()

  const activity = activities.find(a => a.id === id)
  const recs = getActivityRecommendations(id ?? '')

  if (!activity) return <div className="p-8 text-center text-muted-foreground">Activite non trouvee</div>

  const confirmRec = (rec: Recommendation) => updateRecommendation({ ...rec, status: 'confirmed' })
  const rejectRec = (rec: Recommendation) => updateRecommendation({ ...rec, status: 'rejected' })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{activity.title}</h1>
          <p className="text-sm text-muted-foreground">{activity.description}</p>
        </div>
      </div>

      {/* Activity details */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Type</span>
          <div className="mt-1"><StatusBadge status={activity.type} /></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Places</span>
          <p className="mt-1 text-lg font-bold text-card-foreground">{activity.seats}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Date</span>
          <p className="mt-1 text-sm font-medium text-card-foreground">{activity.date}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Lieu</span>
          <p className="mt-1 text-sm font-medium text-card-foreground">{activity.location}</p>
        </div>
      </div>

      {/* Required skills */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-card-foreground">Competences requises</h3>
        <div className="flex flex-wrap gap-2">
          {activity.required_skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm font-medium text-card-foreground">{s.skill_name}</span>
              <StatusBadge status={s.desired_level} />
              <span className="text-xs text-muted-foreground">({Math.round((s.weight ?? 0) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-card-foreground">Employes recommandes ({recs.length})</h3>
        </div>
        {recs.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Aucune recommandation disponible</p>
        ) : (
          <div className="divide-y divide-border">
            {recs.map(rec => (
              <div key={rec.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {rec.employee_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">{rec.employee_name}</span>
                    <span className="text-xs text-muted-foreground">{rec.employee_department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{rec.match_percentage}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">{rec.global_score}</span>
                  </div>
                  <StatusBadge status={rec.status} />
                  {(rec.status === 'recommended' || rec.status === 'confirmed') && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => confirmRec(rec)} className="flex h-8 items-center gap-1 rounded-lg bg-emerald-100 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-200">
                        <Check className="h-3.5 w-3.5" /> Confirmer
                      </button>
                      <button onClick={() => rejectRec(rec)} className="flex h-8 items-center gap-1 rounded-lg bg-red-100 px-3 text-xs font-medium text-red-700 hover:bg-red-200">
                        <X className="h-3.5 w-3.5" /> Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

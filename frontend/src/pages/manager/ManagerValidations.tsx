import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { Check, X, Target, TrendingUp } from 'lucide-react'
import type { Recommendation } from '../../types'

export default function ManagerValidations() {
  const { activities, recommendations, updateRecommendation } = useData()
  const { user } = useAuth()

  const myActivities = activities.filter(a => a.assigned_manager === user?.id)
  const myRecs = recommendations.filter(r => myActivities.some(a => a.id === r.activity_id))
  const pendingRecs = myRecs.filter(r => r.status === 'recommended')

  const confirmRec = (rec: Recommendation) => updateRecommendation({ ...rec, status: 'confirmed' })
  const rejectRec = (rec: Recommendation) => updateRecommendation({ ...rec, status: 'rejected' })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Validations</h1>
        <p className="text-sm text-muted-foreground">{pendingRecs.length} recommandation(s) en attente de validation</p>
      </div>

      {pendingRecs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-12">
          <Check className="h-10 w-10 text-emerald-500" />
          <p className="text-sm text-muted-foreground">Toutes les recommandations ont ete traitees</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingRecs.map(rec => {
            const activity = activities.find(a => a.id === rec.activity_id)
            return (
              <div key={rec.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {rec.employee_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-card-foreground">{rec.employee_name}</span>
                      <span className="text-xs text-muted-foreground">{rec.employee_department}</span>
                    </div>
                  </div>
                  <StatusBadge status={rec.status} />
                </div>

                <div className="mt-3 rounded-lg bg-background p-3">
                  <span className="text-xs font-medium text-muted-foreground">Activite:</span>
                  <span className="ml-2 text-sm font-medium text-card-foreground">{activity?.title ?? 'N/A'}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Score:</span>
                    <span className="text-sm font-bold text-primary">{rec.global_score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{rec.match_percentage}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">{rec.progression_score}%</span>
                  </div>
                </div>

                <p className="mt-2 text-xs italic text-muted-foreground">"{rec.justification}"</p>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
                  <button onClick={() => confirmRec(rec)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    <Check className="h-4 w-4" /> Confirmer
                  </button>
                  <button onClick={() => rejectRec(rec)}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent">
                    <X className="h-4 w-4" /> Rejeter
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* All recommendations for my activities */}
      {myRecs.filter(r => r.status !== 'recommended').length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">Recommandations traitees</h3>
          </div>
          <div className="divide-y divide-border">
            {myRecs.filter(r => r.status !== 'recommended').map(rec => (
              <div key={rec.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {rec.employee_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">{rec.employee_name}</span>
                    <span className="text-xs text-muted-foreground">{activities.find(a => a.id === rec.activity_id)?.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{rec.global_score}%</span>
                  <StatusBadge status={rec.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

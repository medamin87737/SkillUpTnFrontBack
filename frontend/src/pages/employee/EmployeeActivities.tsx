import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { Check, X, Calendar, MapPin, Target } from 'lucide-react'
import type { Recommendation } from '../../types'

export default function EmployeeActivities() {
  const { activities, recommendations, updateRecommendation } = useData()
  const { user } = useAuth()
  const [declineModal, setDeclineModal] = useState<string | null>(null)
  const [declineReason, setDeclineReason] = useState('')

  const myRecs = recommendations.filter(r => r.employee_id === user?.id)

  const acceptActivity = (rec: Recommendation) => updateRecommendation({ ...rec, status: 'accepted' })
  const declineActivity = (recId: string) => {
    const rec = myRecs.find(r => r.id === recId)
    if (rec) {
      updateRecommendation({ ...rec, status: 'declined', decline_reason: declineReason })
      setDeclineModal(null)
      setDeclineReason('')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes activites</h1>
        <p className="text-sm text-muted-foreground">{myRecs.length} activite(s) proposee(s)</p>
      </div>

      <div className="flex flex-col gap-4">
        {myRecs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-12">
            <p className="text-sm text-muted-foreground">Aucune activite proposee pour le moment</p>
          </div>
        ) : (
          myRecs.map(rec => {
            const activity = activities.find(a => a.id === rec.activity_id)
            if (!activity) return null
            return (
              <div key={rec.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-card-foreground">{activity.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">{activity.description}</p>
                  </div>
                  <StatusBadge status={rec.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {activity.date}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {activity.location}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Target className="h-3.5 w-3.5" /> Match: {rec.match_percentage}%</div>
                </div>

                {/* Score */}
                <div className="mt-3 flex items-center gap-4 rounded-lg bg-background p-3">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-primary">{rec.global_score}</span>
                    <span className="text-[10px] text-muted-foreground">Score global</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground italic">"{rec.justification}"</p>
                  </div>
                </div>

                {/* Actions */}
                {(rec.status === 'recommended' || rec.status === 'confirmed') && (
                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
                    <button onClick={() => acceptActivity(rec)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                      <Check className="h-4 w-4" /> Accepter
                    </button>
                    <button onClick={() => setDeclineModal(rec.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent">
                      <X className="h-4 w-4" /> Refuser
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Decline modal */}
      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-card-foreground">Justification du refus</h2>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Veuillez indiquer la raison du refus..."
                rows={4}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => { setDeclineModal(null); setDeclineReason('') }} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-card-foreground hover:bg-accent">Annuler</button>
                <button onClick={() => declineActivity(declineModal)} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90">Confirmer le refus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

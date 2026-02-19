import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { ArrowLeft, Sparkles, Check, X, Send, Brain, Target, TrendingUp } from 'lucide-react'
import type { Recommendation } from '../../types'

export default function HRRecommendations() {
  const { activityId } = useParams()
  const navigate = useNavigate()
  const { activities, getActivityRecommendations, updateRecommendation, updateActivity } = useData()
  const [aiRunning, setAiRunning] = useState(false)
  const [aiDone, setAiDone] = useState(true)

  const activity = activities.find(a => a.id === activityId)
  const recs = getActivityRecommendations(activityId ?? '')

  if (!activity) return <div className="p-8 text-center text-muted-foreground">Activite non trouvee</div>

  const runAI = () => {
    setAiRunning(true)
    setTimeout(() => { setAiRunning(false); setAiDone(true) }, 2000)
  }

  const confirmRec = (rec: Recommendation) => updateRecommendation({ ...rec, status: 'confirmed' })
  const rejectRec = (rec: Recommendation) => updateRecommendation({ ...rec, status: 'rejected' })

  const sendToManager = () => {
    if (activity.assigned_manager) {
      updateActivity({ ...activity, status: 'in_progress' })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Recommandations AI</h1>
          <p className="text-sm text-muted-foreground">{activity.title}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={runAI} disabled={aiRunning}
            className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50">
            {aiRunning ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : <Sparkles className="h-4 w-4" />}
            {aiRunning ? 'Analyse en cours...' : 'Lancer IA'}
          </button>
          <button onClick={sendToManager}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-90">
            <Send className="h-4 w-4" /> Envoyer au Manager
          </button>
        </div>
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Type</span>
          <div className="mt-1"><StatusBadge status={activity.type} /></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Places</span>
          <p className="mt-1 text-lg font-bold text-card-foreground">{activity.seats}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Priorite</span>
          <div className="mt-1"><StatusBadge status={activity.priority} /></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">Recommandes</span>
          <p className="mt-1 text-lg font-bold text-card-foreground">{recs.length}</p>
        </div>
      </div>

      {/* AI processing animation */}
      {aiRunning && (
        <div className="flex items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Brain className="h-12 w-12 text-primary animate-pulse" />
              <div className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-primary/50" />
            </div>
            <p className="text-sm font-medium text-primary">Analyse NLP des profils en cours...</p>
            <p className="text-xs text-muted-foreground">Extraction des competences et matching semantique</p>
          </div>
        </div>
      )}

      {/* Recommendations table */}
      {aiDone && recs.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">Employes recommandes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Employe</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Score Global</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Match</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Progression</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Priorite</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recs.map(rec => (
                  <tr key={rec.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {rec.employee_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-card-foreground">{rec.employee_name}</span>
                          <span className="text-xs text-muted-foreground">{rec.employee_department}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-xs font-bold text-primary">
                          {rec.global_score}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-muted-foreground" />
                        <div className="h-1.5 w-16 rounded-full bg-muted">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${rec.match_percentage}%` }} />
                        </div>
                        <span className="text-xs font-medium">{rec.match_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{rec.experience_score}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600">{rec.progression_score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">{rec.priority_fit}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={rec.status} />
                    </td>
                    <td className="px-4 py-3">
                      {rec.status === 'recommended' && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => confirmRec(rec)} className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><Check className="h-4 w-4" /></button>
                          <button onClick={() => rejectRec(rec)} className="flex h-7 w-7 items-center justify-center rounded-md bg-red-100 text-red-700 hover:bg-red-200"><X className="h-4 w-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skill details for each recommendation */}
      {aiDone && recs.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Detail matching par competence</h3>
          <div className="flex flex-col gap-4">
            {recs.slice(0, 3).map(rec => (
              <div key={rec.id} className="rounded-lg border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">{rec.employee_name}</span>
                  <span className="text-xs text-muted-foreground italic">"{rec.justification}"</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {rec.skills_match.map((sm, i) => (
                    <div key={i} className="rounded-lg bg-card p-3">
                      <span className="text-xs font-medium text-card-foreground">{sm.skill_name}</span>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${sm.match_percentage}%` }} />
                        </div>
                        <span className="text-xs font-medium">{sm.match_percentage}%</span>
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>Score: {sm.employee_score}</span>
                        <span>Requis: {sm.required_score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

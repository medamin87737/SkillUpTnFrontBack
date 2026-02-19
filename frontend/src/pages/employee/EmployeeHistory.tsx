import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { History, Calendar, Target } from 'lucide-react'

export default function EmployeeHistory() {
  const { recommendations, activities } = useData()
  const { user } = useAuth()

  const myRecs = recommendations.filter(r => r.employee_id === user?.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Historique de participation</h1>
        <p className="text-sm text-muted-foreground">Suivi de toutes vos activites</p>
      </div>

      {myRecs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-12">
          <History className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Aucun historique de participation</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myRecs.map(rec => {
            const activity = activities.find(a => a.id === rec.activity_id)
            return (
              <div key={rec.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-card-foreground">{activity?.title ?? 'Activite inconnue'}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {activity?.date}</span>
                    <span className="flex items-center gap-1"><Target className="h-3 w-3" /> Score: {rec.global_score}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activity && <StatusBadge status={activity.type} />}
                  <StatusBadge status={rec.status} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

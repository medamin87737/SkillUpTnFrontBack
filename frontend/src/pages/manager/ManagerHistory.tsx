import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { History, Calendar } from 'lucide-react'

export default function ManagerHistory() {
  const { activities } = useData()
  const { user } = useAuth()

  const completedActivities = activities.filter(a => a.assigned_manager === user?.id && (a.status === 'completed' || a.status === 'in_progress'))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Historique</h1>
        <p className="text-sm text-muted-foreground">Activites passees et en cours</p>
      </div>

      {completedActivities.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-12">
          <History className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Aucun historique</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {completedActivities.map(a => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-card-foreground">{a.title}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {a.date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={a.type} />
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'

export default function ManagerActivities() {
  const { activities } = useData()
  const { user } = useAuth()

  const myActivities = activities.filter(a => a.assigned_manager === user?.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes activites</h1>
        <p className="text-sm text-muted-foreground">{myActivities.length} activites assignees</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {myActivities.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-12">
            <p className="text-sm text-muted-foreground">Aucune activite assignee</p>
          </div>
        ) : (
          myActivities.map(a => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{a.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {a.date}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {a.location}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> {a.seats} places</div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <div className="flex gap-2">
                  <StatusBadge status={a.type} />
                  <StatusBadge status={a.priority} />
                </div>
                <Link to={`/manager/activity/${a.id}`} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

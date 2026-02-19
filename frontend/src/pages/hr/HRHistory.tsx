import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/shared/StatusBadge'
import { History, Calendar, MapPin, Users } from 'lucide-react'

export default function HRHistory() {
  const { activities } = useData()
  const completedActivities = activities.filter(a => a.status === 'completed' || a.status === 'in_progress')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Historique des activites</h1>
        <p className="text-sm text-muted-foreground">Suivi complet des activites passees et en cours</p>
      </div>

      <div className="flex flex-col gap-4">
        {completedActivities.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-12">
            <History className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Aucun historique disponible</p>
          </div>
        ) : (
          completedActivities.map(a => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{a.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">{a.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.type} />
                  <StatusBadge status={a.status} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {new Date(a.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {a.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {a.seats} places
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { Bell, Check } from 'lucide-react'
import { cn } from '../../../lib/utils'

export default function EmployeeNotifications() {
  const { getUserNotifications, markNotificationRead } = useData()
  const { user } = useAuth()

  const notifications = user ? getUserNotifications(user.id) : []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">{notifications.filter(n => !n.read).length} non lue(s)</p>
      </div>

      <div className="flex flex-col gap-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-12">
            <Bell className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Aucune notification</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={cn(
              'flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-shadow hover:shadow-sm',
              !n.read && 'border-primary/20 bg-primary/5'
            )}>
              <div className="flex items-center gap-3">
                {!n.read && <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-card-foreground">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.message}</span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {!n.read && (
                <button onClick={() => markNotificationRead(n.id)} className="flex h-8 items-center gap-1 rounded-lg bg-accent px-3 text-xs font-medium text-accent-foreground hover:opacity-80">
                  <Check className="h-3.5 w-3.5" /> Lu
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

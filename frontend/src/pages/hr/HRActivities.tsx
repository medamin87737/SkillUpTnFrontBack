import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/shared/StatusBadge'
import DataTable from '../../components/shared/DataTable'
import { Plus, Search, Sparkles, Pencil, Trash2, X, Check } from 'lucide-react'
import type { Activity } from '../../types'
import { useToast } from '../../../hooks/use-toast'

export default function HRActivities() {
  const { activities, updateActivity, deleteActivity } = useData()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Edit state
  const [editing, setEditing] = useState<Activity | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const openEdit = (a: Activity) => {
    setDeleteId(null)
    setEditing(a)
    setEditTitle(a.title)
    setEditDescription(a.description)
  }

  const openDelete = (id: string) => {
    setEditing(null)
    setDeleteId(id)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setEditLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/activities/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Erreur lors de la modification')
      }
      updateActivity({ ...editing, title: editTitle, description: editDescription })
      toast({ title: 'Activité mise à jour', description: 'Les informations ont été enregistrées.' })
      setEditing(null)
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message || 'Impossible de modifier cette activité.' })
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/activities/${deleteId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Erreur lors de la suppression')
      }
      deleteActivity(deleteId)
      toast({ title: 'Activité supprimée', description: "L'activité a été supprimée avec succès." })
      setDeleteId(null)
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message || 'Impossible de supprimer cette activité.' })
    } finally {
      setDeleteLoading(false)
    }
  }

  const filtered = activities.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns = [
    {
      key: 'title', header: 'Titre', render: (a: Activity) => (
        <div className="flex flex-col">
          <span className="font-medium text-card-foreground">{a.title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">{a.description}</span>
        </div>
      )
    },
    { key: 'type', header: 'Type', render: (a: Activity) => <StatusBadge status={a.type} /> },
    { key: 'seats', header: 'Places', render: (a: Activity) => <span className="font-medium">{a.seats}</span> },
    { key: 'date', header: 'Date', render: (a: Activity) => <span className="text-sm">{new Date(a.date).toLocaleDateString('fr-FR')}</span> },
    { key: 'priority', header: 'Priorité', render: (a: Activity) => <StatusBadge status={a.priority} /> },
    { key: 'status', header: 'Statut', render: (a: Activity) => <StatusBadge status={a.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      isAction: true,
      render: (a: Activity) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/hr/recommendations/${a.id}`}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-accent"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Reco
          </Link>
          <button
            type="button"
            onClick={() => openEdit(a)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent"
            title="Modifier"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => openDelete(a.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-destructive/40 bg-background text-destructive hover:bg-destructive/10"
            title="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activités</h1>
          <p className="text-sm text-muted-foreground">{activities.length} activités au total</p>
        </div>
        <Link to="/hr/create-activity" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Créer
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">Tous statuts</option>
          <option value="draft">Brouillon</option>
          <option value="open">Ouvert</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
        </select>
      </div>

      {/* Panel confirmation suppression */}
      {deleteId && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-destructive">
            Confirmer la suppression de cette activité ? Cette action est irréversible.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              disabled={deleteLoading}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" /> Annuler
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-sm text-white hover:opacity-90 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleteLoading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      )}

      {/* Panel édition inline */}
      {editing && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Modifier l'activité</h2>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Titre</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={editLoading}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                <Check className="h-3.5 w-3.5" />
                {editLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={filtered} emptyMessage="Aucune activité trouvée" />
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Globe, X, MapPin, Shield, BookMarked, Package, Calendar, Layers } from 'lucide-react'
import useWikiStore from '../store/wikiStore'
import useStoryStore from '../store/storyStore'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'

const TYPES = ['location', 'faction', 'lore', 'item', 'event', 'other']

const TYPE_META = {
  location: { label: 'Location', icon: MapPin,     badge: 'badge badge-blue'   },
  faction:  { label: 'Faction',  icon: Shield,     badge: 'badge badge-purple' },
  lore:     { label: 'Lore',     icon: BookMarked, badge: 'badge badge-amber'  },
  item:     { label: 'Item',     icon: Package,    badge: 'badge badge-green'  },
  event:    { label: 'Event',    icon: Calendar,   badge: 'badge badge-coral'  },
  other:    { label: 'Other',    icon: Layers,     badge: 'badge'              },
}

const EMPTY_FORM = { type: 'location', title: '', body: '', tags: '' }

export default function WorldBible() {
  const { storyId } = useParams()
  const { worldEntries, fetchWorldEntries, createWorldEntry, updateWorldEntry, deleteWorldEntry } = useWikiStore()
  const { fetchStory, activeStory } = useStoryStore()

  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState(null)

  useEffect(() => {
    fetchWorldEntries(storyId)
    if (!activeStory) fetchStory(storyId)
  }, [storyId])

  const filtered = filter === 'all' ? worldEntries : worldEntries.filter(e => e.type === filter)

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) }
    const entry = await createWorldEntry(storyId, payload)
    setSaving(false)
    if (entry) { setShowCreate(false); setForm(EMPTY_FORM); setSelected(entry) }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...editForm,
      tags: typeof editForm.tags === 'string'
        ? editForm.tags.split(',').map(s => s.trim()).filter(Boolean)
        : editForm.tags,
    }
    const updated = await updateWorldEntry(storyId, selected._id, payload)
    setSaving(false)
    if (updated) { setSelected(updated); setEditMode(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return
    await deleteWorldEntry(storyId, id)
    if (selected?._id === id) setSelected(null)
  }

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const ef = (k) => (e) => setEditForm({ ...editForm, [k]: e.target.value })

  return (
    <div className="flex h-full overflow-hidden">

      {/* List panel */}
      <div className="w-56 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ borderRight: '0.5px solid var(--border)', background: 'var(--bg-primary)' }}>

        <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>World bible</span>
          <button onClick={() => setShowCreate(true)} className="w-6 h-6 flex items-center justify-center rounded-md" style={{ color: 'var(--text-faint)' }}>
            <Plus size={14} />
          </button>
        </div>

        {/* Type filter tabs */}
        <div className="px-2 py-2 flex flex-wrap gap-1" style={{ borderBottom: '0.5px solid var(--border)' }}>
          {['all', ...TYPES].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className="text-xs px-2 py-0.5 rounded-full transition-colors"
              style={{
                background: filter === t ? 'var(--bg-tertiary)' : 'transparent',
                color: filter === t ? 'var(--text-primary)' : 'var(--text-faint)',
                fontWeight: filter === t ? 500 : 400,
              }}>
              {t === 'all' ? 'All' : TYPE_META[t].label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-faint)' }}>No entries yet</p>
          ) : (
            filtered.map(entry => {
              const Icon = TYPE_META[entry.type]?.icon || Layers
              return (
                <div key={entry._id}
                  onClick={() => { setSelected(entry); setEditMode(false) }}
                  className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors"
                  style={{
                    background: selected?._id === entry._id ? 'var(--bg-tertiary)' : 'transparent',
                    borderLeft: selected?._id === entry._id ? '2px solid var(--ink)' : '2px solid transparent',
                  }}
                >
                  <Icon size={13} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{entry.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{TYPE_META[entry.type]?.label}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-6 max-w-2xl">
            {editMode ? (
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Edit entry</h2>
                  <button type="button" onClick={() => setEditMode(false)} style={{ color: 'var(--text-faint)' }}><X size={16} /></button>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Title *</label>
                  <input type="text" className="input" required value={editForm.title} onChange={ef('title')} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
                  <select className="input" value={editForm.type} onChange={ef('type')}>
                    {TYPES.map(t => <option key={t} value={t}>{TYPE_META[t].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Details</label>
                  <textarea className="input resize-none" rows={6} value={editForm.body || ''} onChange={ef('body')} placeholder="Describe this entry…" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tags</label>
                  <input type="text" className="input" value={typeof editForm.tags === 'string' ? editForm.tags : editForm.tags?.join(', ')} onChange={ef('tags')} placeholder="Comma separated" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                  <button type="button" className="btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h1 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>{selected.title}</h1>
                      <span className={TYPE_META[selected.type]?.badge}>{TYPE_META[selected.type]?.label}</span>
                    </div>
                    {selected.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selected.tags.map(t => <span key={t} className="badge">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditForm({ ...selected, tags: selected.tags?.join(', ') || '' }); setEditMode(true) }} className="btn-ghost text-xs">Edit</button>
                    <button onClick={() => handleDelete(selected._id)} className="btn-ghost text-xs" style={{ color: '#712b13' }}>Delete</button>
                  </div>
                </div>

                {selected.body ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                    {selected.body}
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No details yet. Click Edit to add some.</p>
                )}
              </>
            )}
          </div>
        ) : (
          <EmptyState icon={Globe} message="Select an entry or add something to your world"
            action="New entry" onAction={() => setShowCreate(true)} />
        )}
      </div>

      {showCreate && (
        <Modal title="New world entry" onClose={() => setShowCreate(false)} size="md">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Title *</label>
              <input type="text" className="input" required value={form.title} onChange={f('title')} placeholder="e.g. The Iron Gate" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select className="input" value={form.type} onChange={f('type')}>
                {TYPES.map(t => <option key={t} value={t}>{TYPE_META[t].label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Details</label>
              <textarea className="input resize-none" rows={4} value={form.body} onChange={f('body')} placeholder="Describe this entry…" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tags <span style={{ color: 'var(--text-faint)' }}>(comma separated)</span></label>
              <input type="text" className="input" value={form.tags} onChange={f('tags')} placeholder="magic, northern, ancient…" />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creating…' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

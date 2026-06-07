import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Trash2, Users, ChevronRight, X } from 'lucide-react'
import useWikiStore from '../store/wikiStore'
import useStoryStore from '../store/storyStore'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'

const ROLES = ['protagonist', 'antagonist', 'supporting', 'minor', 'other']
const ROLE_BADGE = {
  protagonist: 'badge badge-purple',
  antagonist:  'badge badge-coral',
  supporting:  'badge badge-blue',
  minor:       'badge',
  other:       'badge',
}

const EMPTY_FORM = {
  name: '', aliases: '', role: 'supporting',
  traits: '', backstory: '', appearance: '', motivations: '',
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = [
  { bg: '#eeedfe', color: '#534ab7' },
  { bg: '#e1f5ee', color: '#0f6e56' },
  { bg: '#faece7', color: '#712b13' },
  { bg: '#e6f1fb', color: '#185fa5' },
  { bg: '#eaf3de', color: '#3b6d11' },
  { bg: '#faeeda', color: '#854f0b' },
]
const avatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

export default function Characters() {
  const { storyId } = useParams()
  const { characters, loading, fetchCharacters, createCharacter, updateCharacter, deleteCharacter } = useWikiStore()
  const { fetchStory, activeStory } = useStoryStore()

  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState(null)

  useEffect(() => {
    fetchCharacters(storyId)
    if (!activeStory) fetchStory(storyId)
  }, [storyId])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      aliases: form.aliases.split(',').map(s => s.trim()).filter(Boolean),
      traits:  form.traits.split(',').map(s => s.trim()).filter(Boolean),
    }
    const ch = await createCharacter(storyId, payload)
    setSaving(false)
    if (ch) { setShowCreate(false); setForm(EMPTY_FORM); setSelected(ch) }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...editForm,
      aliases: typeof editForm.aliases === 'string'
        ? editForm.aliases.split(',').map(s => s.trim()).filter(Boolean)
        : editForm.aliases,
      traits: typeof editForm.traits === 'string'
        ? editForm.traits.split(',').map(s => s.trim()).filter(Boolean)
        : editForm.traits,
    }
    const updated = await updateCharacter(storyId, selected._id, payload)
    setSaving(false)
    if (updated) { setSelected(updated); setEditMode(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this character?')) return
    await deleteCharacter(storyId, id)
    if (selected?._id === id) setSelected(null)
  }

  const openEdit = () => {
    setEditForm({
      ...selected,
      aliases: selected.aliases?.join(', ') || '',
      traits:  selected.traits?.join(', ') || '',
    })
    setEditMode(true)
  }

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const ef = (k) => (e) => setEditForm({ ...editForm, [k]: e.target.value })

  return (
    <div className="flex h-full overflow-hidden">

      {/* List panel */}
      <div className="w-56 flex-shrink-0 flex flex-col overflow-hidden"
        style={{ borderRight: '0.5px solid var(--border)', background: 'var(--bg-primary)' }}>
        <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Characters {characters.length > 0 && `(${characters.length})`}
          </span>
          <button onClick={() => setShowCreate(true)} className="w-6 h-6 flex items-center justify-center rounded-md" style={{ color: 'var(--text-faint)' }}>
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {characters.length === 0 && !loading ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-faint)' }}>No characters yet</p>
          ) : (
            characters.map((ch) => {
              const av = avatarColor(ch.name)
              return (
                <div key={ch._id}
                  onClick={() => { setSelected(ch); setEditMode(false) }}
                  className="group flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors"
                  style={{
                    background: selected?._id === ch._id ? 'var(--bg-tertiary)' : 'transparent',
                    borderLeft: selected?._id === ch._id ? '2px solid var(--ink)' : '2px solid transparent',
                  }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                    style={{ background: av.bg, color: av.color }}>
                    {initials(ch.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{ch.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{ch.role}</p>
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
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Edit character</h2>
                  <button type="button" onClick={() => setEditMode(false)} style={{ color: 'var(--text-faint)' }}><X size={16} /></button>
                </div>
                {[
                  { label: 'Name', key: 'name', required: true },
                  { label: 'Aliases (comma separated)', key: 'aliases' },
                  { label: 'Traits (comma separated)', key: 'traits' },
                  { label: 'Appearance', key: 'appearance', multiline: true },
                  { label: 'Backstory', key: 'backstory', multiline: true },
                  { label: 'Motivations', key: 'motivations', multiline: true },
                ].map(({ label, key, required, multiline }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
                    {multiline
                      ? <textarea className="input resize-none" rows={3} value={editForm[key] || ''} onChange={ef(key)} />
                      : <input type="text" className="input" required={required} value={editForm[key] || ''} onChange={ef(key)} />
                    }
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</label>
                  <select className="input" value={editForm.role} onChange={ef('role')}>
                    {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                  <button type="button" className="btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                    style={{ background: avatarColor(selected.name).bg, color: avatarColor(selected.name).color }}>
                    {initials(selected.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>{selected.name}</h1>
                      <span className={ROLE_BADGE[selected.role]}>{selected.role}</span>
                    </div>
                    {selected.aliases?.length > 0 && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        Also known as: {selected.aliases.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={openEdit} className="btn-ghost text-xs">Edit</button>
                    <button onClick={() => handleDelete(selected._id)} className="btn-ghost text-xs" style={{ color: '#712b13' }}>Delete</button>
                  </div>
                </div>

                {selected.traits?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Traits</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.traits.map(t => <span key={t} className="badge">{t}</span>)}
                    </div>
                  </div>
                )}

                {[
                  { label: 'Appearance', key: 'appearance' },
                  { label: 'Backstory', key: 'backstory' },
                  { label: 'Motivations', key: 'motivations' },
                ].map(({ label, key }) => selected[key] ? (
                  <div key={key} className="mb-4">
                    <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{selected[key]}</p>
                  </div>
                ) : null)}
              </>
            )}
          </div>
        ) : (
          <EmptyState icon={Users} message="Select a character or create a new one"
            action="New character" onAction={() => setShowCreate(true)} />
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <Modal title="New character" onClose={() => setShowCreate(false)} size="lg">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Name *</label>
                <input type="text" className="input" required value={form.name} onChange={f('name')} placeholder="Character name" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</label>
                <select className="input" value={form.role} onChange={f('role')}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Aliases</label>
                <input type="text" className="input" value={form.aliases} onChange={f('aliases')} placeholder="Comma separated" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Traits</label>
                <input type="text" className="input" value={form.traits} onChange={f('traits')} placeholder="brave, cunning, loyal…" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Backstory</label>
                <textarea className="input resize-none" rows={3} value={form.backstory} onChange={f('backstory')} />
              </div>
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

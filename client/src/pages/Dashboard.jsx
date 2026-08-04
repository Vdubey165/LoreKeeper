import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Trash2, Pencil, Check, X } from 'lucide-react'
import useStoryStore from '../store/storyStore'
import { TEMPLATE_STORY, TEMPLATE_CHARACTERS, TEMPLATE_WORLD_ENTRIES, TEMPLATE_PLOT_NODES, TEMPLATE_CHAPTER } from '../lib/templateData'
import api from '../lib/api'


const GENRES = ['fantasy', 'sci-fi', 'thriller', 'mystery', 'romance', 'horror', 'drama', 'historical', 'other']

const GENRE_BADGE = {
  fantasy: 'badge-purple', 'sci-fi': 'badge-blue', thriller: 'badge-coral',
  mystery: 'badge-amber', romance: 'badge-coral', horror: 'badge-coral',
  drama: 'badge-green', historical: 'badge-amber', other: '',
}

export default function Dashboard() {
  const { stories, fetchStories, createStory, deleteStory, updateStory, setActiveStory, loading } = useStoryStore()
  
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', genre: 'fantasy' })
  const [creating, setCreating] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [renameDraft, setRenameDraft] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchStories() }, [])

  
  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    const story = await createStory(form)
    setCreating(false)
    if (story) {
      setShowModal(false)
      setForm({ title: '', description: '', genre: 'fantasy' })
      setActiveStory(story)
      navigate(`/story/${story._id}/chapters`)
    }
  }

  const handleCreateFromTemplate = async () => {
    setCreatingTemplate(true)
    try {
      const story = await createStory(TEMPLATE_STORY)
      if (!story) return
      const sid = story._id
      await Promise.all([
        ...TEMPLATE_CHARACTERS.map(c => api.post(`/stories/${sid}/characters`, c)),
        ...TEMPLATE_WORLD_ENTRIES.map(e => api.post(`/stories/${sid}/world`, e)),
        ...TEMPLATE_PLOT_NODES.map(n => api.post(`/stories/${sid}/plot`, n)),
      ])
      await api.post(`/stories/${sid}/chapters`, TEMPLATE_CHAPTER)
      setActiveStory(story)
      navigate(`/story/${sid}/chapters`)
    } finally {
      setCreatingTemplate(false)
    }
  }

  const handleOpen = (story) => {
    setActiveStory(story)
    navigate(`/story/${story._id}/chapters`)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (confirm('Delete this story? This cannot be undone.')) {
      await deleteStory(id)
    }
  }

  const startRename = (e, story) => {
    e.stopPropagation()
    setRenamingId(story._id)
    setRenameDraft(story.title)
  }

  const commitRename = async (e, id) => {
    e.stopPropagation()
    const trimmed = renameDraft.trim()
    if (trimmed) await updateStory(id, { title: trimmed })
    setRenamingId(null)
  }

  const cancelRename = (e) => {
    e.stopPropagation()
    setRenamingId(null)
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Your stories</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateFromTemplate}
            disabled={creatingTemplate}
            className="btn-ghost flex items-center gap-1.5 text-sm"
          >
            {creatingTemplate ? 'Creating…' : '✦ Try a template'}
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-1.5">
            <Plus size={15} />
            New story
          </button>
        </div>
      </div>


      {/* Stories grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="card h-36 animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <BookOpen size={40} style={{ color: 'var(--text-faint)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No stories yet. Start your first one.</p>
          <button onClick={() => setShowModal(true)} className="btn-ghost mt-1">
            Create a story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <div
              key={story._id}
              onClick={() => handleOpen(story)}
              className="card cursor-pointer group relative hover:border-[var(--ink)] transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`badge ${GENRE_BADGE[story.genre] || ''}`}>{story.genre}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {renamingId !== story._id && (
                    <button
                      onClick={(e) => startRename(e, story)}
                      className="p-1 rounded"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, story._id)}
                    className="p-1 rounded"
                    style={{ color: 'var(--text-faint)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {renamingId === story._id ? (
                <div className="flex items-center gap-1 mt-2 mb-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    className="text-sm font-medium bg-transparent outline-none flex-1 min-w-0"
                    style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--ink)' }}
                    value={renameDraft}
                    onChange={(e) => setRenameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(e, story._id)
                      if (e.key === 'Escape') cancelRename(e)
                    }}
                  />
                  <button onClick={(e) => commitRename(e, story._id)} className="p-0.5 flex-shrink-0" style={{ color: 'var(--ink)' }}>
                    <Check size={14} />
                  </button>
                  <button onClick={cancelRename} className="p-0.5 flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <h2 className="text-sm font-medium mt-2 mb-1 leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {story.title}
                </h2>
              )}

              {story.description && (
                <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
                  {story.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-auto pt-2" style={{ borderTop: '0.5px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                  {story.wordCount?.toLocaleString() || 0} words
                </span>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                  {new Date(story.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="card w-full max-w-md">
            <h2 className="text-base font-medium mb-4" style={{ color: 'var(--text-primary)' }}>New story</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Title</label>
                <input
                  type="text" className="input" placeholder="Story title" required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description <span style={{ color: 'var(--text-faint)' }}>(optional)</span></label>
                <textarea
                  className="input resize-none" rows={2} placeholder="What's this story about?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Genre</label>
                <select className="input" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                  {GENRES.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating…' : 'Create story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
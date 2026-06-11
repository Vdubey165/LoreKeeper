import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Trash2, MoreHorizontal } from 'lucide-react'
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
  const { stories, fetchStories, createStory, deleteStory, setActiveStory, loading } = useStoryStore()
  const [showBanner, setShowBanner] = useState(() => !localStorage.getItem('lk_welcomed'))
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', genre: 'fantasy' })
  const [creating, setCreating] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchStories() }, [])

  const handleDismiss = () => {
    localStorage.setItem('lk_welcomed', '1')
    setShowBanner(false)
  }

  const handleBannerCreate = () => {
    localStorage.setItem('lk_welcomed', '1')
    setShowBanner(false)
    setShowModal(true)
  }

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

      {showBanner && (
        <WelcomeBanner onDismiss={handleDismiss} onCreateStory={handleBannerCreate} />
      )}

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
                <button
                  onClick={(e) => handleDelete(e, story._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                  style={{ color: 'var(--text-faint)' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <h2 className="text-sm font-medium mt-2 mb-1 leading-snug" style={{ color: 'var(--text-primary)' }}>
                {story.title}
              </h2>

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

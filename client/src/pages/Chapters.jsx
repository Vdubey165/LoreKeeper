import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Trash2, BookOpen, Check, Loader, ArrowLeft } from 'lucide-react'
import useChapterStore from '../store/chapterStore'
import useStoryStore from '../store/storyStore'
import TiptapEditor from '../components/editor/TiptapEditor'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'

const STATUS_BADGE = {
  idea:    { label: 'Idea',    cls: 'badge' },
  draft:   { label: 'Draft',   cls: 'badge badge-amber' },
  revised: { label: 'Revised', cls: 'badge badge-blue' },
  done:    { label: 'Done',    cls: 'badge badge-green' },
}

export default function Chapters() {
  const { storyId } = useParams()
  const {
    chapters, activeChapter, loading, saving, lastSaved,
    fetchChapters, fetchChapter, createChapter, saveChapter,
    deleteChapter, setActiveChapter,
  } = useChapterStore()
  const { fetchStory, activeStory } = useStoryStore()

  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)
  // mobile: 'list' | 'editor'
  const [mobileView, setMobileView] = useState('list')

  useEffect(() => {
    fetchChapters(storyId)
    if (!activeStory) fetchStory(storyId)
  }, [storyId])

  const handleSelectChapter = async (ch) => {
    if (activeChapter?._id === ch._id) {
      setMobileView('editor')
      return
    }
    const full = await fetchChapter(storyId, ch._id)
    setActiveChapter(full)
    setMobileView('editor')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    const ch = await createChapter(storyId, { title: newTitle.trim(), status: 'draft' })
    setCreating(false)
    if (ch) {
      setShowNew(false)
      setNewTitle('')
      setActiveChapter(ch)
      setMobileView('editor')
    }
  }

  const handleEditorUpdate = (payload) => {
    if (!activeChapter) return
    saveChapter(storyId, activeChapter._id, payload)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Delete this chapter?')) return
    await deleteChapter(storyId, id)
    setMobileView('list')
  }

  const handleStatusChange = async (status) => {
    if (!activeChapter) return
    await saveChapter(storyId, activeChapter._id, { status })
  }

  const formatSaved = () => {
    if (!lastSaved) return null
    const diff = Math.round((Date.now() - lastSaved) / 1000)
    if (diff < 5) return 'Saved just now'
    if (diff < 60) return `Saved ${diff}s ago`
    return `Saved ${Math.round(diff / 60)}m ago`
  }

  const ChapterList = (
    <div
      className="flex flex-col overflow-hidden h-full"
      style={{ background: 'var(--bg-primary)', borderRight: '0.5px solid var(--border)' }}
    >
      <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Chapters {chapters.length > 0 && `(${chapters.length})`}
        </span>
        <button
          onClick={() => setShowNew(true)}
          className="w-6 h-6 flex items-center justify-center rounded-md"
          style={{ color: 'var(--text-faint)' }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={16} className="animate-spin" style={{ color: 'var(--text-faint)' }} />
          </div>
        ) : chapters.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: 'var(--text-faint)' }}>No chapters yet</p>
        ) : (
          chapters.map((ch, i) => (
            <div
              key={ch._id}
              onClick={() => handleSelectChapter(ch)}
              className="group flex items-start gap-2 px-3 py-3 cursor-pointer transition-colors"
              style={{
                background: activeChapter?._id === ch._id ? 'var(--bg-tertiary)' : 'transparent',
                borderLeft: activeChapter?._id === ch._id ? '2px solid var(--ink)' : '2px solid transparent',
              }}
            >
              <span className="text-xs mt-0.5 flex-shrink-0 w-4" style={{ color: 'var(--text-faint)' }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug truncate" style={{ color: 'var(--text-primary)' }}>{ch.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                  {ch.wordCount > 0 ? `${ch.wordCount} words` : STATUS_BADGE[ch.status]?.label}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, ch._id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded flex-shrink-0 mt-0.5"
                style={{ color: 'var(--text-faint)' }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const EditorView = (
    <div className="flex flex-col h-full overflow-hidden">
      {activeChapter ? (
        <>
          <div
            className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
            style={{ borderBottom: '0.5px solid var(--border)', background: 'var(--bg-primary)' }}
          >
            {/* Back button — mobile only */}
            <button
              onClick={() => setMobileView('list')}
              className="md:hidden p-1 rounded mr-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={16} />
            </button>

            <input
              className="flex-1 text-sm font-medium bg-transparent outline-none min-w-0"
              style={{ color: 'var(--text-primary)' }}
              value={activeChapter.title}
              onChange={(e) => setActiveChapter({ ...activeChapter, title: e.target.value })}
              onBlur={(e) => saveChapter(storyId, activeChapter._id, { title: e.target.value })}
            />

            <select
              value={activeChapter.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs rounded-lg px-2 py-1 outline-none border-0 flex-shrink-0"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {Object.entries(STATUS_BADGE).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {saving ? (
                <Loader size={12} className="animate-spin" style={{ color: 'var(--text-faint)' }} />
              ) : lastSaved ? (
                <Check size={12} style={{ color: 'var(--ink)' }} />
              ) : null}
              <span className="text-xs hidden sm:block" style={{ color: 'var(--text-faint)' }}>
                {saving ? 'Saving…' : formatSaved()}
              </span>
            </div>
          </div>

          <TiptapEditor content={activeChapter.content} onUpdate={handleEditorUpdate} />
        </>
      ) : (
        <EmptyState
          icon={BookOpen}
          message={chapters.length === 0 ? 'Create your first chapter to start writing' : 'Select a chapter from the list'}
          action={chapters.length === 0 ? 'New chapter' : null}
          onAction={() => setShowNew(true)}
        />
      )}
    </div>
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop: both panels always rendered side by side */}
      <div className="hidden md:flex w-52 flex-shrink-0 h-full overflow-hidden">
        {ChapterList}
      </div>
      <div className="hidden md:flex flex-1 min-w-0 overflow-hidden">
        {EditorView}
      </div>

      {/* Mobile: toggle between list and editor */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        {mobileView === 'list' ? ChapterList : EditorView}
      </div>

      {showNew && (
        <Modal title="New chapter" onClose={() => setShowNew(false)} size="sm">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Chapter title</label>
              <input
                autoFocus type="text" className="input" placeholder="e.g. The Iron Gate"
                value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

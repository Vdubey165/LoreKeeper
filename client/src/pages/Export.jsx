import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FileText, BookOpen, Globe, Download, Loader } from 'lucide-react'
import api from '../lib/api'
import useStoryStore from '../store/storyStore'
import { exportChaptersPDF, exportWikiPDF, exportFullStoryPDF } from '../lib/exportPDF'

const EXPORTS = [
  {
    id: 'full',
    icon: Download,
    title: 'Full story export',
    desc: 'Cover page + all chapters in reading order',
    badge: 'Recommended',
    badgeCls: 'badge badge-purple',
  },
  {
    id: 'chapters',
    icon: BookOpen,
    title: 'Chapters only',
    desc: 'Just the written chapters as a clean manuscript',
    badge: null,
  },
  {
    id: 'wiki',
    icon: Globe,
    title: 'World bible',
    desc: 'Characters, locations, factions, lore — formatted as a reference document',
    badge: null,
  },
]

export default function Export() {
  const { storyId } = useParams()
  const { activeStory, fetchStory } = useStoryStore()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [data, setData] = useState({ chapters: [], characters: [], worldEntries: [] })

  useEffect(() => {
    if (!activeStory) fetchStory(storyId)
    const load = async () => {
      try {
        const [chapRes, charRes, worldRes] = await Promise.all([
          api.get(`/stories/${storyId}/chapters`),
          api.get(`/stories/${storyId}/characters`),
          api.get(`/stories/${storyId}/world`),
        ])
        // fetch full chapter content for each
        const fullChapters = await Promise.all(
          chapRes.data.map(ch => api.get(`/stories/${storyId}/chapters/${ch._id}`).then(r => r.data))
        )
        setData({ chapters: fullChapters, characters: charRes.data, worldEntries: worldRes.data })
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [storyId])

  const handleExport = async (type) => {
    if (!activeStory) return
    setLoading(type)
    // small delay so spinner shows before window.open
    await new Promise(r => setTimeout(r, 100))
    try {
      if (type === 'chapters') exportChaptersPDF(activeStory, data.chapters)
      if (type === 'wiki')     exportWikiPDF(activeStory, data.characters, data.worldEntries)
      if (type === 'full')     exportFullStoryPDF(activeStory, data.chapters, data.characters, data.worldEntries)
    } finally {
      setLoading(null)
    }
  }

  const story = activeStory

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Export</h1>
          {story && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {story.title} &nbsp;·&nbsp; {story.wordCount?.toLocaleString() || 0} words
            </p>
          )}
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-16 gap-2" style={{ color: 'var(--text-faint)' }}>
            <Loader size={16} className="animate-spin" />
            <span className="text-sm">Loading story data…</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {EXPORTS.map(({ id, icon: Icon, title, desc, badge, badgeCls }) => (
              <div key={id} className="card flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--bg-tertiary)' }}>
                  <Icon size={18} style={{ color: 'var(--ink)' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{title}</span>
                    {badge && <span className={badgeCls}>{badge}</span>}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  <div className="flex gap-3 mt-1.5 text-xs" style={{ color: 'var(--text-faint)' }}>
                    {id !== 'wiki' && <span>{data.chapters.length} chapter{data.chapters.length !== 1 ? 's' : ''}</span>}
                    {id !== 'chapters' && <span>{data.characters.length} characters · {data.worldEntries.length} world entries</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleExport(id)}
                  disabled={!!loading}
                  className="btn-primary flex items-center gap-1.5 flex-shrink-0 text-xs"
                >
                  {loading === id
                    ? <><Loader size={12} className="animate-spin" /> Preparing…</>
                    : <><FileText size={12} /> Export PDF</>
                  }
                </button>
              </div>
            ))}

            <p className="text-xs text-center mt-2" style={{ color: 'var(--text-faint)' }}>
              A print dialog will open — choose "Save as PDF" in your browser or printer settings
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

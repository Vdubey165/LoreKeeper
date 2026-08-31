import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Feather, BookOpen, Users, Globe, ListTree, Sparkles, X,
} from 'lucide-react'
import {
  TEMPLATE_STORY, TEMPLATE_CHARACTERS, TEMPLATE_WORLD_ENTRIES,
  TEMPLATE_PLOT_NODES, TEMPLATE_CHAPTER,
} from '../lib/templateData'

const TABS = [
  { id: 'chapter',    label: 'Chapter editor',  icon: BookOpen },
  { id: 'characters', label: 'Characters',      icon: Users },
  { id: 'world',      label: 'World bible',     icon: Globe },
  { id: 'plot',       label: 'Plot outline',    icon: ListTree },
  { id: 'assistant',  label: 'Lore assistant',  icon: Sparkles },
]

const STATUS_BADGE = { idea: 'badge', draft: 'badge-amber', revised: 'badge-blue', done: 'badge-green' }
const WORLD_BADGE   = { location: 'badge-blue', faction: 'badge-purple', lore: 'badge-amber', item: 'badge', event: 'badge-coral' }

const SAMPLE_QA = [
  { q: 'What is the Binding, and who created it?',
    a: 'Per your World Bible, the Binding tethers a person\u2019s life force to an object, place, or person — the Crown\u2019s official record credits imperial scholars, but your notes say it was actually stolen from the Ashen peoples during the Sundering. That gap between the public story and the truth looks like it\u2019s meant to be a slow-burn reveal — want help planning where Sable finds that out?' },
  { q: 'Is there anything inconsistent between Cael\u2019s backstory and chapter one?',
    a: 'Nothing contradictory yet. Cael\u2019s desertion at the Siege of Vel Nara isn\u2019t mentioned in chapter one, and his line "I\u2019m telling you to burn it so I can say I told you to" tracks with a soldier who\u2019s learned to expect bad outcomes — consistent with his profile.' },
]

export default function Demo() {
  const [tab, setTab] = useState('chapter')
  const [dismissed, setDismissed] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      {!dismissed && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
          style={{ background: 'var(--bg-tertiary)', borderBottom: '0.5px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text-primary)' }}>
            You're viewing a read-only sample story. <Link to="/register" className="font-medium underline" style={{ color: 'var(--ink)' }}>Sign up free</Link> to write and save your own.
          </span>
          <button onClick={() => setDismissed(true)} aria-label="Dismiss" style={{ color: 'var(--text-faint)' }}>
            <X size={15} />
          </button>
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Feather size={18} style={{ color: 'var(--ink)' }} />
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'var(--text-primary)' }}>Lorekeeper</span>
          </Link>
          <div className="w-px h-5 hidden sm:block" style={{ background: 'var(--border)' }} />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{TEMPLATE_STORY.title}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{TEMPLATE_STORY.genre} · demo story</div>
          </div>
        </div>
        <Link to="/register" className="btn-primary shrink-0">Get started</Link>
      </header>

      <nav className="flex gap-1 px-6 pt-3 overflow-x-auto" style={{ borderBottom: '0.5px solid var(--border)' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-t-lg whitespace-nowrap"
            style={{
              color: tab === id ? 'var(--text-primary)' : 'var(--text-muted)',
              background: tab === id ? 'var(--bg-primary)' : 'transparent',
              borderBottom: tab === id ? '2px solid var(--ink)' : '2px solid transparent',
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {tab === 'chapter' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                {TEMPLATE_CHAPTER.title}
              </h2>
              <span className={`badge ${STATUS_BADGE[TEMPLATE_CHAPTER.status]}`}>{TEMPLATE_CHAPTER.status}</span>
            </div>
            <div className="ProseMirror">
              {TEMPLATE_CHAPTER.content.content.map((node, i) => {
                const text = (node.content || []).map((c) => c.text).join('')
                return node.type === 'blockquote'
                  ? <blockquote key={i}>{text}</blockquote>
                  : <p key={i}>{text}</p>
              })}
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--text-faint)' }}>
              Editing is disabled in the demo. <Link to="/register" className="underline">Sign up</Link> to write your own chapters.
            </p>
          </div>
        )}

        {tab === 'characters' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {TEMPLATE_CHARACTERS.map((c) => (
              <div key={c.name} className="card">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</h3>
                  <span className="badge">{c.role}</span>
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-faint)' }}>{c.aliases.join(' · ')}</div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{c.appearance}</p>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{c.backstory}</p>
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{c.motivations}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'world' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {TEMPLATE_WORLD_ENTRIES.map((w) => (
              <div key={w.title} className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{w.title}</h3>
                  <span className={`badge ${WORLD_BADGE[w.type]}`}>{w.type}</span>
                </div>
                <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>{w.body}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {w.tags.map((t) => <span key={t} className="badge">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'plot' && (
          <div className="flex flex-col gap-3">
            {[1, 2].map((act) => (
              <div key={act}>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-faint)' }}>ACT {act}</div>
                <div className="flex flex-col gap-2">
                  {TEMPLATE_PLOT_NODES.filter((n) => n.act === act).map((n) => (
                    <div key={n.title} className="card">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</h3>
                        <span className={`badge ${STATUS_BADGE[n.status]}`}>{n.status}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{n.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'assistant' && (
          <div className="card">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: 'var(--ink)' }} />
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Lore assistant — example conversation</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-faint)' }}>
              This is a recorded example, not a live chat. In your own workspace, this panel answers
              using your actual characters and world bible.
            </p>
            <div className="flex flex-col gap-4">
              {SAMPLE_QA.map(({ q, a }) => (
                <div key={q}>
                  <div className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>{q}</div>
                  <div className="text-sm rounded-lg p-3" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>{a}</div>
                </div>
              ))}
            </div>
            <Link to="/register" className="btn-primary inline-block mt-5">Try it on your own story</Link>
          </div>
        )}
      </main>
    </div>
  )
}

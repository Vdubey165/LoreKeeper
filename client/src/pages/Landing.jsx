import { Link } from 'react-router-dom'
import { Feather, BookOpen, Users, Globe, ListTree, Sparkles, Moon, Sun } from 'lucide-react'
import useThemeStore from '../store/themeStore'
import { TEMPLATE_STORY, TEMPLATE_CHAPTER } from '../lib/templateData'

const FEATURES = [
  { icon: BookOpen,  label: 'Chapter editor',  blurb: 'Rich text, autosave, and status tracking from idea to done.' },
  { icon: Users,     label: 'Characters wiki', blurb: 'One profile per character — traits, backstory, motivations.' },
  { icon: Globe,     label: 'World bible',     blurb: 'Locations, factions, lore, and items, filterable by type.' },
  { icon: ListTree,  label: 'Plot outline',    blurb: 'Scene-level planning organised by act, drag to reorder.' },
  { icon: Sparkles,  label: 'Lore assistant',  blurb: 'Reads your characters and world before it answers anything.' },
]

const openingLines = TEMPLATE_CHAPTER.content.content
  .slice(0, 4)
  .map((node) => (node.content || []).map((c) => c.text).join(''))

export default function Landing() {
  const { theme, toggle } = useThemeStore()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <header className="max-w-[1320px] mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-2">
          <Feather size={20} style={{ color: 'var(--ink)' }} />
          <span className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Lorekeeper</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="btn-ghost !px-2" aria-label="Toggle theme">
            {theme === 'warm' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </header>

      <main className="max-w-[1320px] mx-auto px-6 md:px-10">
        {/* Hero */}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center pt-10 pb-20">
          <div>
            <h1
              className="text-4xl md:text-[2.75rem] font-medium mb-5 leading-[1.15]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
            >
              A home for the story you're building — not just the draft.
            </h1>
            <p className="text-base mb-8 max-w-md" style={{ color: 'var(--text-muted)' }}>
              Lorekeeper keeps your chapters, characters, and world in one workspace,
              with an AI assistant that reads all of it before answering a single question.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Link to="/demo" className="btn-primary">
                ✦ View the live demo
              </Link>
              <Link to="/register" className="btn-ghost">
                Create your own workspace
              </Link>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              No account needed to look around — it's free either way.
            </p>
          </div>

          {/* Manuscript preview, grounded in the actual template story */}
          <div className="relative">
            <div
              className="absolute -top-3 -right-3 w-full h-full rounded-xl hidden sm:block"
              style={{ background: 'var(--bg-tertiary)', border: '0.5px solid var(--border)' }}
            />
            <div className="card relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs mb-0.5" style={{ color: 'var(--text-faint)' }}>{TEMPLATE_STORY.title}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                    {TEMPLATE_CHAPTER.title}
                  </div>
                </div>
                <span className="badge badge-amber">{TEMPLATE_CHAPTER.status}</span>
              </div>
              <div className="ProseMirror text-sm">
                {openingLines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
              <Link to="/demo" className="text-xs font-medium underline mt-2 inline-block" style={{ color: 'var(--ink)' }}>
                Keep reading in the demo →
              </Link>
            </div>
          </div>
        </div>

        {/* Features, editorial list rather than a card grid */}
        <div className="border-t pb-20" style={{ borderColor: 'var(--border)' }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5">
            {FEATURES.map(({ icon: Icon, label, blurb }, i) => (
              <div
                key={label}
                className="py-6 px-0 lg:px-5"
                style={{
                  borderTop: '0.5px solid var(--border)',
                  borderLeft: i > 0 ? '0.5px solid var(--border)' : 'none',
                }}
              >
                <Icon size={17} style={{ color: 'var(--ink)' }} className="mb-3" />
                <div className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{blurb}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

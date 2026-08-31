import { Link } from 'react-router-dom'
import {
  Feather, LayoutGrid, BookOpen, Users, Globe, ListTree, FileOutput,
  Settings, UserCircle, Sparkles, Moon, Sun, ChevronLeft,
} from 'lucide-react'
import useThemeStore from '../store/themeStore'
import { TEMPLATE_STORY, TEMPLATE_CHAPTER } from '../lib/templateData'

const FEATURES = [
  { icon: BookOpen,  label: 'Chapter editor',  blurb: 'Rich text, autosave, and status tracking from idea to done.' },
  { icon: Users,     label: 'Characters wiki', blurb: 'One profile per character — traits, backstory, motivations.' },
  { icon: Globe,     label: 'World bible',     blurb: 'Locations, factions, lore, and items, filterable by type.' },
  { icon: ListTree,  label: 'Plot outline',    blurb: 'Scene-level planning organised by act, drag to reorder.' },
  { icon: Sparkles,  label: 'Lore assistant',  blurb: 'Reads your characters and world before it answers anything.' },
]

const NAV = [
  { icon: LayoutGrid, label: 'Stories' },
  { icon: BookOpen,   label: 'Chapters', active: true },
  { icon: Users,      label: 'Characters' },
  { icon: Globe,      label: 'World bible' },
  { icon: ListTree,   label: 'Plot outline' },
  { icon: FileOutput, label: 'Export' },
]

const openingLines = TEMPLATE_CHAPTER.content.content
  .slice(0, 3)
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
        {/* Hero copy */}
        <div className="max-w-2xl pt-10 pb-10">
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
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/demo" className="btn-primary">
              ✦ Open the live workspace
            </Link>
            <Link to="/register" className="btn-ghost">
              Create your own — free
            </Link>
          </div>
        </div>

        {/* The workspace itself, at real scale — not an illustration of it */}
        <Link
          to="/demo"
          className="group block rounded-xl overflow-hidden mb-3"
          style={{
            border: '0.5px solid var(--border)',
            boxShadow: '0 12px 32px -12px rgba(44, 40, 37, 0.18)',
          }}
        >
          <div className="hidden md:flex" style={{ height: '480px', background: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <div
              className="w-[190px] flex-shrink-0 flex flex-col"
              style={{ background: 'var(--bg-primary)', borderRight: '0.5px solid var(--border)' }}
            >
              <div className="flex items-center gap-2.5 px-3 py-3" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <Feather size={16} style={{ color: 'var(--ink)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Lorekeeper</span>
              </div>
              <div className="px-3 py-2.5" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-faint)' }}>Current story</p>
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{TEMPLATE_STORY.title}</p>
              </div>
              <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5">
                {NAV.map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className="nav-item"
                    style={active ? { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' } : undefined}
                  >
                    <Icon size={14} />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </nav>
              <div className="px-2 py-2 flex flex-col gap-0.5" style={{ borderTop: '0.5px solid var(--border)' }}>
                <div className="nav-item"><Settings size={14} /><span className="text-sm">Settings</span></div>
                <div className="nav-item"><UserCircle size={14} /><span className="text-sm">Account</span></div>
              </div>
            </div>

            {/* Manuscript */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center justify-between px-8 py-3.5" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                  {TEMPLATE_CHAPTER.title}
                </span>
                <span className="badge badge-amber">{TEMPLATE_CHAPTER.status}</span>
              </div>
              <div className="flex-1 overflow-hidden px-8 py-6 relative">
                <div className="ProseMirror text-[15px]">
                  {openingLines.map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
                />
              </div>
            </div>

            {/* AI panel sliver */}
            <div className="w-[230px] flex-shrink-0 flex flex-col" style={{ borderLeft: '0.5px solid var(--border)' }}>
              <div className="flex items-center gap-1.5 px-3 py-3.5" style={{ borderBottom: '0.5px solid var(--border)' }}>
                <Sparkles size={14} style={{ color: 'var(--ink)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Lore assistant</span>
              </div>
              <div className="px-3 py-3 flex flex-col gap-2 flex-1 overflow-hidden">
                <div className="text-xs font-medium self-end px-2.5 py-1.5 rounded-lg max-w-[85%]" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                  What's the Second Binding?
                </div>
                <div className="text-xs px-2.5 py-1.5 rounded-lg" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                  Per your World Bible, the Empress isn't performing the Binding —
                  the redacted pages suggest she's its subject. That's the act-one reveal...
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: manuscript only, chrome hidden */}
          <div className="md:hidden px-6 py-6" style={{ background: 'var(--bg-primary)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
                {TEMPLATE_CHAPTER.title}
              </span>
              <span className="badge badge-amber">{TEMPLATE_CHAPTER.status}</span>
            </div>
            <div className="ProseMirror text-sm">
              {openingLines.slice(0, 2).map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        </Link>
        <p className="text-xs mb-16" style={{ color: 'var(--text-faint)' }}>
          This is the actual workspace, live — click to explore it. No account needed to look around.
        </p>

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

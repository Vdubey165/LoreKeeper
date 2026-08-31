import { Link } from 'react-router-dom'
import { Feather, BookOpen, Users, Globe, ListTree, Sparkles, Moon, Sun } from 'lucide-react'
import useThemeStore from '../store/themeStore'

const FEATURES = [
  { icon: BookOpen,  label: 'Chapter editor',   blurb: 'Rich text, autosave, status tracking.' },
  { icon: Users,     label: 'Characters wiki',  blurb: 'Profiles, traits, backstory, motivations.' },
  { icon: Globe,     label: 'World bible',      blurb: 'Locations, factions, lore, items, events.' },
  { icon: ListTree,  label: 'Plot outline',     blurb: 'Scene-level planning by act.' },
  { icon: Sparkles,  label: 'Lore assistant',   blurb: 'An AI that has actually read your story.' },
]

export default function Landing() {
  const { theme, toggle } = useThemeStore()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
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

      <main className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-medium mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            A unified writing workspace for storytellers.
          </h1>
          <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
            Stop juggling Scrivener for drafts, Notion for character notes, and Google Docs
            for everything else. Lorekeeper puts it all in one place — with an AI assistant
            that has actually read your story before you ask it anything.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/demo" className="btn-primary">
              ✦ View the live demo
            </Link>
            <Link to="/register" className="btn-ghost">
              Create your own workspace — free
            </Link>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-faint)' }}>
            No account needed to look around.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-14">
          {FEATURES.map(({ icon: Icon, label, blurb }) => (
            <div key={label} className="card">
              <Icon size={18} style={{ color: 'var(--ink)' }} className="mb-2" />
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{blurb}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

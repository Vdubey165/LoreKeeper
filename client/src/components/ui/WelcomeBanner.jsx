import { useNavigate } from 'react-router-dom'
import { Notebook, Users, Globe, ListTree, Sparkles } from 'lucide-react'

const SECTIONS = [
  { icon: Notebook,  title: 'Chapters',     desc: 'Write, autosave' },
  { icon: Users,     title: 'Characters',   desc: 'Traits, backstory' },
  { icon: Globe,     title: 'World bible',  desc: 'Lore, locations' },
  { icon: ListTree,  title: 'Plot outline', desc: 'Scene structure' },
  { icon: Sparkles,  title: 'AI assistant', desc: 'Knows your lore' },
]

export default function WelcomeBanner({ onDismiss, onCreateStory }) {
  return (
    <div className="mb-6 overflow-hidden" style={{ borderRadius: '14px', border: '0.5px solid var(--border)' }}>

      {/* Dark header with ruled lines — stays dark in both themes intentionally */}
      <div style={{ background: '#1e1b17', padding: '2.25rem 2rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 29px)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6b6560', marginBottom: '10px' }}>
            Welcome to Lorekeeper
          </p>
          <h1 style={{ fontSize: '21px', fontWeight: 500, color: '#faf7f2', lineHeight: 1.3, marginBottom: '8px' }}>
            Your story workspace<br />is ready.
          </h1>
          <p style={{ fontSize: '13px', color: '#7a7470', lineHeight: 1.65, maxWidth: '400px' }}>
            One place for your chapters, characters, world, and plot. An AI that reads your own lore before answering.
          </p>
        </div>
      </div>

      {/* Body — adapts to theme */}
      <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '7px', marginBottom: '1.25rem' }}>
          {SECTIONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--bg-primary)', border: '0.5px solid var(--border)', borderRadius: '9px', padding: '11px 9px' }}>
              <Icon size={14} style={{ color: 'var(--ink)', marginBottom: '5px', display: 'block' }} />
              <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1px' }}>{title}</p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.45 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={onCreateStory} className="btn-primary" style={{ fontSize: '12px' }}>
            Create my first story
          </button>
          <button onClick={onDismiss} className="btn-ghost" style={{ fontSize: '12px' }}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

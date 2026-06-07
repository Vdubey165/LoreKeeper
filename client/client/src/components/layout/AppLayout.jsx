import { useState, useEffect } from 'react'
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom'
import {
  Feather, LayoutGrid, BookOpen, Users, Globe,
  ListTree, Settings, UserCircle, Menu,
  Sun, Moon, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import useStoryStore from '../../store/storyStore'
import AIPanel from '../ai/AIPanel'

const NAV = [
  { to: '',          icon: LayoutGrid, label: 'Stories',      exact: true },
  { to: 'chapters',  icon: BookOpen,   label: 'Chapters'   },
  { to: 'characters',icon: Users,      label: 'Characters' },
  { to: 'world',     icon: Globe,      label: 'World bible'},
  { to: 'plot',      icon: ListTree,   label: 'Plot outline'},
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [aiOpen, setAiOpen]           = useState(false)
  const { storyId } = useParams()
  const { user, logout }   = useAuthStore()
  const { theme, toggle }  = useThemeStore()
  const { activeStory, fetchStory } = useStoryStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // fetch story when navigating directly to a story route
  useEffect(() => {
    if (storyId && !activeStory) fetchStory(storyId)
  }, [storyId])

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = ({ mobile = false }) => (
    <div
      className="flex flex-col h-full transition-all duration-200"
      style={{
        width: mobile ? '14rem' : sidebarOpen ? '13rem' : '3.25rem',
        background: 'var(--bg-primary)',
        borderRight: '0.5px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {/* Logo row */}
      <div className="flex items-center gap-2.5 px-3 py-3"
        style={{ borderBottom: '0.5px solid var(--border)', minHeight: '44px' }}>
        <Feather size={17} style={{ color: 'var(--ink)', flexShrink: 0 }} />
        {(sidebarOpen || mobile) && (
          <span className="text-sm font-medium flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
            Lorekeeper
          </span>
        )}
        {!mobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-0.5 rounded transition-colors"
            style={{ color: 'var(--text-faint)', marginLeft: sidebarOpen ? undefined : 'auto' }}
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>

      {/* Active story label */}
      {storyId && (sidebarOpen || mobile) && activeStory && (
        <div className="px-3 py-2" style={{ borderBottom: '0.5px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Current story</p>
          <p className="text-xs font-medium truncate mt-0.5" style={{ color: 'var(--text-primary)' }}>
            {activeStory.title}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, exact }) => {
          const fullTo = to === ''
            ? '/'
            : storyId ? `/story/${storyId}/${to}` : `/${to}`
          const collapsed = !sidebarOpen && !mobile
          return (
            <NavLink
              key={label}
              to={fullTo}
              end={exact}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center !px-0' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {(sidebarOpen || mobile) && <span className="text-sm">{label}</span>}
            </NavLink>
          )
        })}

        {/* AI button — only inside a story */}
        {storyId && (
          <button
            onClick={() => { setAiOpen(true); setMobileOpen(false) }}
            className={`nav-item w-full mt-1 ${!sidebarOpen && !mobile ? 'justify-center !px-0' : ''}`}
            title={!sidebarOpen && !mobile ? 'Lore assistant' : undefined}
            style={{ color: aiOpen ? 'var(--ink)' : undefined }}
          >
            <Sparkles size={15} style={{ flexShrink: 0 }} />
            {(sidebarOpen || mobile) && <span className="text-sm">Lore assistant</span>}
          </button>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2 flex flex-col gap-0.5" style={{ borderTop: '0.5px solid var(--border)' }}>
        <button
          onClick={toggle}
          className={`nav-item w-full ${!sidebarOpen && !mobile ? 'justify-center !px-0' : ''}`}
          title={!sidebarOpen && !mobile ? 'Toggle theme' : undefined}
        >
          {theme === 'warm'
            ? <Moon size={15} style={{ flexShrink: 0 }} />
            : <Sun  size={15} style={{ flexShrink: 0 }} />}
          {(sidebarOpen || mobile) && (
            <span className="text-sm">{theme === 'warm' ? 'Dark mode' : 'Warm mode'}</span>
          )}
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''} ${!sidebarOpen && !mobile ? 'justify-center !px-0' : ''}`
          }
          title={!sidebarOpen && !mobile ? 'Settings' : undefined}
        >
          <Settings size={15} style={{ flexShrink: 0 }} />
          {(sidebarOpen || mobile) && <span className="text-sm">Settings</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className={`nav-item w-full ${!sidebarOpen && !mobile ? 'justify-center !px-0' : ''}`}
          title={!sidebarOpen && !mobile ? `Sign out (${user?.name})` : undefined}
        >
          <UserCircle size={15} style={{ flexShrink: 0 }} />
          {(sidebarOpen || mobile) && (
            <div className="flex flex-col items-start min-w-0">
              <span className="text-xs font-medium truncate" style={{ maxWidth: '90px', color: 'var(--text-primary)' }}>
                {user?.name}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Sign out</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <SidebarContent mobile />
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <div
          className="flex md:hidden items-center gap-3 px-4 flex-shrink-0"
          style={{ height: '44px', background: 'var(--bg-primary)', borderBottom: '0.5px solid var(--border)' }}
        >
          <button onClick={() => setMobileOpen(true)} style={{ color: 'var(--text-muted)' }}>
            <Menu size={20} />
          </button>
          <Feather size={15} style={{ color: 'var(--ink)' }} />
          <span className="text-sm font-medium flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
            {activeStory?.title || 'Lorekeeper'}
          </span>
          {storyId && (
            <button onClick={() => setAiOpen(true)} style={{ color: 'var(--text-muted)' }}>
              <Sparkles size={17} />
            </button>
          )}
        </div>

        {/* Content + AI panel */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>

          {/* AI panel — right collapsible */}
          {aiOpen && storyId && (
            <div
              className="flex-shrink-0 flex flex-col overflow-hidden"
              style={{
                width: '260px',
                borderLeft: '0.5px solid var(--border)',
              }}
            >
              <AIPanel storyId={storyId} onClose={() => setAiOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

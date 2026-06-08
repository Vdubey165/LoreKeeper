export default function EmptyState({ icon: Icon, title, message, action, onAction }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRadius: '12px', margin: '1.5rem', border: '0.5px solid var(--border)', maxHeight: '320px', alignSelf: 'flex-start', width: 'calc(100% - 3rem)' }}>
      {/* Dark header — intentionally stays dark in both themes */}
      <div style={{
        background: '#1e1b17',
        borderRadius: '11px 11px 0 0',
        padding: '2rem 2rem 1.75rem',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 29px)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Icon size={26} style={{ color: '#6b6560', marginBottom: '10px' }} />
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#faf7f2', marginBottom: '6px' }}>
            {title}
          </p>
          <p style={{ fontSize: '12px', color: '#7a7470', lineHeight: 1.65, maxWidth: '280px', margin: '0 auto' }}>
            {message}
          </p>
        </div>
      </div>

      {/* Warm footer */}
      {action && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '0 0 11px 11px',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button onClick={onAction} className="btn-primary" style={{ fontSize: '12px' }}>
            {action}
          </button>
        </div>
      )}
    </div>
  )
}

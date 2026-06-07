export default function EmptyState({ icon: Icon, message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Icon size={36} style={{ color: 'var(--text-faint)' }} />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
      {action && (
        <button onClick={onAction} className="btn-ghost mt-1">{action}</button>
      )}
    </div>
  )
}

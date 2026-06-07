export default function EmptyState({ icon: Icon, message, action, onAction }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
      <Icon size={36} style={{ color: 'var(--text-faint)' }} />
      <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>{message}</p>
      {action && (
        <button onClick={onAction} className="btn-ghost mt-1">{action}</button>
      )}
    </div>
  )
}

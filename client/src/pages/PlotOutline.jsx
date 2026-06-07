import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, GripVertical, Trash2, ListTree, ChevronDown, ChevronRight } from 'lucide-react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import usePlotStore from '../store/plotStore'
import useStoryStore from '../store/storyStore'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'

const STATUS_OPTS = ['idea', 'draft', 'done']
const STATUS_BADGE = {
  idea:  { label: 'Idea',  cls: 'badge' },
  draft: { label: 'Draft', cls: 'badge badge-amber' },
  done:  { label: 'Done',  cls: 'badge badge-green' },
}
const STATUS_DOT = { idea: '#b4b2a9', draft: '#ef9f27', done: '#639922' }

function SortableNode({ node, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node._id })
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [titleVal, setTitleVal] = useState(node.title)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  const saveTitle = () => {
    if (titleVal.trim() && titleVal !== node.title) onUpdate(node._id, { title: titleVal })
    setEditing(false)
  }

  return (
    <div ref={setNodeRef}
      className="rounded-lg mb-2 overflow-hidden"
      style={{ ...style, border: '0.5px solid var(--border)', background: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag handle */}
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-shrink-0 touch-none" style={{ color: 'var(--text-faint)' }}>
          <GripVertical size={14} />
        </button>

        {/* Status dot */}
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_DOT[node.status] }} />

        {/* Title */}
        {editing ? (
          <input
            autoFocus className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: 'var(--text-primary)' }}
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') { setTitleVal(node.title); setEditing(false) } }}
          />
        ) : (
          <span className="flex-1 text-sm cursor-text" style={{ color: 'var(--text-primary)' }}
            onClick={() => setEditing(true)}>
            {node.title}
          </span>
        )}

        {/* Status selector */}
        <select
          value={node.status}
          onChange={(e) => onUpdate(node._id, { status: e.target.value })}
          className="text-xs rounded px-1.5 py-0.5 outline-none border-0"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTS.map(s => <option key={s} value={s}>{STATUS_BADGE[s].label}</option>)}
        </select>

        {/* Expand notes */}
        <button onClick={() => setExpanded(!expanded)} style={{ color: 'var(--text-faint)' }}>
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>

        <button onClick={() => onDelete(node._id)} style={{ color: 'var(--text-faint)' }}>
          <Trash2 size={12} />
        </button>
      </div>

      {expanded && (
        <div className="px-8 pb-3" style={{ borderTop: '0.5px solid var(--border)' }}>
          <textarea
            className="w-full text-xs bg-transparent outline-none resize-none mt-2"
            style={{ color: 'var(--text-muted)' }}
            rows={3}
            placeholder="Add notes for this scene…"
            defaultValue={node.notes || ''}
            onBlur={(e) => onUpdate(node._id, { notes: e.target.value })}
          />
        </div>
      )}
    </div>
  )
}

export default function PlotOutline() {
  const { storyId } = useParams()
  const { nodes, loading, fetchNodes, createNode, updateNode, deleteNode, reorderNodes, setNodesLocal } = usePlotStore()
  const { fetchStory, activeStory } = useStoryStore()

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', act: 1, status: 'idea' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchNodes(storyId)
    if (!activeStory) fetchStory(storyId)
  }, [storyId])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = nodes.findIndex(n => n._id === active.id)
    const newIdx = nodes.findIndex(n => n._id === over.id)
    const reordered = arrayMove(nodes, oldIdx, newIdx)
    setNodesLocal(reordered)
    await reorderNodes(storyId, reordered.map(n => n._id))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    const node = await createNode(storyId, { ...form, order: nodes.length })
    setCreating(false)
    if (node) { setShowCreate(false); setForm({ title: '', act: 1, status: 'idea' }) }
  }

  const handleUpdate = (id, payload) => updateNode(storyId, id, payload)
  const handleDelete = async (id) => {
    if (!confirm('Delete this plot node?')) return
    await deleteNode(storyId, id)
  }

  // Group by act
  const acts = [...new Set(nodes.map(n => n.act))].sort()

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Plot outline</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {nodes.length} scene{nodes.length !== 1 ? 's' : ''} · drag to reorder
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-1.5">
            <Plus size={14} /> Add scene
          </button>
        </div>

        {nodes.length === 0 ? (
          <EmptyState icon={ListTree} message="No plot nodes yet. Start outlining your story."
            action="Add scene" onAction={() => setShowCreate(true)} />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={nodes.map(n => n._id)} strategy={verticalListSortingStrategy}>
              {acts.map(act => (
                <div key={act} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium" style={{ color: 'var(--ink)' }}>Act {act}</span>
                    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {nodes.filter(n => n.act === act).length} scenes
                    </span>
                  </div>
                  {nodes.filter(n => n.act === act).map(node => (
                    <SortableNode key={node._id} node={node} onUpdate={handleUpdate} onDelete={handleDelete} />
                  ))}
                </div>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {showCreate && (
        <Modal title="New scene" onClose={() => setShowCreate(false)} size="sm">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Scene title *</label>
              <input type="text" className="input" required autoFocus
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Kiran reaches the Iron Gate" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Act</label>
                <select className="input" value={form.act} onChange={(e) => setForm({ ...form, act: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5].map(a => <option key={a} value={a}>Act {a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTS.map(s => <option key={s} value={s}>{STATUS_BADGE[s].label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={creating}>{creating ? 'Adding…' : 'Add scene'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

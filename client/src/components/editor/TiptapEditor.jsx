import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect, useRef, useCallback } from 'react'
import {
  Bold, Italic, List, ListOrdered,
  Quote, Undo, Redo, Minus
} from 'lucide-react'

const ToolbarBtn = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick() }}
    title={title}
    className="w-7 h-7 flex items-center justify-center rounded-md transition-colors text-xs"
    style={{
      background: active ? 'var(--bg-tertiary)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-muted)',
    }}
  >
    {children}
  </button>
)

const Divider = () => (
  <div className="w-px h-4 mx-1 self-center" style={{ background: 'var(--border)' }} />
)

export default function TiptapEditor({ content, onUpdate, editable = true }) {
  const saveTimer = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your chapter…' }),
      CharacterCount,
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      if (!onUpdate) return
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        const json = editor.getJSON()
        const text = editor.getText()
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        onUpdate({ content: json, plainText: text, wordCount: words })
      }, 1500) // autosave after 1.5s of inactivity
    },
  })

  // Sync external content changes (e.g. switching chapters)
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content || '')
    }
  }, [content])

  useEffect(() => () => clearTimeout(saveTimer.current), [])

  if (!editor) return null

  return (
    <div className="flex flex-col h-full">
      {editable && (
        <div
          className="flex items-center gap-0.5 px-4 py-1.5 flex-shrink-0 flex-wrap"
          style={{ borderBottom: '0.5px solid var(--border)' }}
        >
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
            <Bold size={13} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
            <Italic size={13} />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
            <List size={13} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
            <ListOrdered size={13} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
            <Quote size={13} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Divider">
            <Minus size={13} />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
            <Undo size={13} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
            <Redo size={13} />
          </ToolbarBtn>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-6 md:px-16 md:py-8">
        <div className="max-w-2xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {editable && (
        <div
          className="px-4 py-1.5 flex items-center gap-4 flex-shrink-0"
          style={{ borderTop: '0.5px solid var(--border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {editor.storage.characterCount.words()} words
          </span>
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {editor.storage.characterCount.characters()} characters
          </span>
        </div>
      )}
    </div>
  )
}

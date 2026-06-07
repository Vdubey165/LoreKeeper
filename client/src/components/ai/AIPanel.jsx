import { useState, useRef, useEffect } from 'react'
import { Send, Loader, Sparkles, X, Trash2 } from 'lucide-react'
import api from '../../lib/api'

export default function AIPanel({ storyId, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I know your story's characters, world, and recent chapters. Ask me anything — plot holes, character consistency, what happens next.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/ai/chat', {
        storyId,
        messages: nextMessages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0),
      })
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...nextMessages, {
        role: 'assistant',
        content: 'Something went wrong. Check that your AI API key is configured.',
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const clearChat = () => setMessages([messages[0]])

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
        style={{ borderBottom: '0.5px solid var(--border)' }}>
        <Sparkles size={14} style={{ color: 'var(--ink)' }} />
        <span className="text-xs font-medium flex-1" style={{ color: 'var(--text-primary)' }}>
          Lore assistant
        </span>
        <button onClick={clearChat} title="Clear chat" className="p-1 rounded" style={{ color: 'var(--text-faint)' }}>
          <Trash2 size={12} />
        </button>
        <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-faint)' }}>
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="text-xs leading-relaxed px-3 py-2 rounded-xl max-w-[90%]"
              style={{
                background: msg.role === 'user' ? 'var(--bg-tertiary)' : '#eeedfe',
                color: msg.role === 'user' ? 'var(--text-primary)' : '#3c3489',
                borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl flex items-center gap-1.5" style={{ background: '#eeedfe' }}>
              <Loader size={11} className="animate-spin" style={{ color: '#534ab7' }} />
              <span className="text-xs" style={{ color: '#534ab7' }}>Thinking…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 flex-shrink-0" style={{ borderTop: '0.5px solid var(--border)' }}>
        <div className="flex items-end gap-2 rounded-xl px-3 py-2"
          style={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)' }}>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your story…"
            className="flex-1 text-xs bg-transparent outline-none resize-none"
            style={{ color: 'var(--text-primary)', maxHeight: '80px' }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
            style={{
              background: input.trim() ? 'var(--ink)' : 'var(--bg-tertiary)',
              color: input.trim() ? '#faf7f2' : 'var(--text-faint)',
            }}
          >
            <Send size={11} />
          </button>
        </div>
        <p className="text-xs text-center mt-1.5" style={{ color: 'var(--text-faint)' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

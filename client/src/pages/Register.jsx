import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Feather, Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { register, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await register(name, email, password)
    if (ok) navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Feather size={22} style={{ color: 'var(--ink)' }} />
          <span className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Lorekeeper</span>
        </div>

        <div className="card">
          <h1 className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Create your workspace</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Start writing, stay organised</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={{ background: '#faece7', color: '#712b13' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Name</label>
              <input
                type="text"
                className="input"
                placeholder="Your name"
                value={name}
                onChange={(e) => { clearError(); setName(e.target.value) }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { clearError(); setEmail(e.target.value) }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => { clearError(); setPassword(e.target.value) }}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-faint)' }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-1" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center mt-5" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--ink)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

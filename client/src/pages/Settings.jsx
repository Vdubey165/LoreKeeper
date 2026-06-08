import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Trash2, Check, AlertCircle } from 'lucide-react'
import useAuthStore from '../store/authStore'
import api from '../lib/api'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card mb-4">
      <div className="flex items-center gap-2 mb-4" style={{ borderBottom: '0.5px solid var(--border)', paddingBottom: '12px' }}>
        <Icon size={15} style={{ color: 'var(--ink)' }} />
        <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Alert({ type, message }) {
  if (!message) return null
  const isError = type === 'error'
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-4"
      style={{ background: isError ? '#faece7' : '#eaf3de', color: isError ? '#712b13' : '#3b6d11' }}>
      {isError ? <AlertCircle size={13} /> : <Check size={13} />}
      {message}
    </div>
  )
}

export default function Settings() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  // Profile
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  // Password
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })
  const [savingPw, setSavingPw] = useState(false)

  // Delete
  const [deletePw, setDeletePw] = useState('')
  const [deleteMsg, setDeleteMsg] = useState({ type: '', text: '' })
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg({ type: '', text: '' })
    try {
      const { data } = await api.put('/auth/profile', { name, email })
      useAuthStore.setState({ user: { ...user, ...data } })
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: 'New passwords do not match' })
      return
    }
    if (newPw.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }
    setSavingPw(true)
    setPwMsg({ type: '', text: '' })
    try {
      await api.put('/auth/password', { currentPassword: currentPw, newPassword: newPw })
      setPwMsg({ type: 'success', text: 'Password updated successfully' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' })
    } finally {
      setSavingPw(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeleteMsg({ type: '', text: '' })
    try {
      await api.delete('/auth/account', { data: { password: deletePw } })
      logout()
      navigate('/login')
    } catch (err) {
      setDeleteMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete account' })
      setDeleting(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-base font-medium mb-6" style={{ color: 'var(--text-primary)' }}>Settings</h1>

        {/* Profile */}
        <Section icon={User} title="Profile">
          <Alert type={profileMsg.type} message={profileMsg.text} />
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Name</label>
              <input type="text" className="input" value={name}
                onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" className="input" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <button type="submit" className="btn-primary" disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Section>

        {/* Password */}
        <Section icon={Lock} title="Change password">
          <Alert type={pwMsg.type} message={pwMsg.text} />
          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Current password</label>
              <input type="password" className="input" value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>New password</label>
              <input type="password" className="input" value={newPw}
                onChange={(e) => setNewPw(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Confirm new password</label>
              <input type="password" className="input" value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)} required />
            </div>
            <div>
              <button type="submit" className="btn-primary" disabled={savingPw}>
                {savingPw ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </Section>

        {/* Delete account */}
        <Section icon={Trash2} title="Delete account">
          <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            This will permanently delete your account and all your stories, chapters, characters, and world entries. This cannot be undone.
          </p>
          <Alert type={deleteMsg.type} message={deleteMsg.text} />

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-ghost text-xs"
              style={{ color: '#712b13', borderColor: '#f5c3b4' }}
            >
              Delete my account
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium" style={{ color: '#712b13' }}>
                Enter your password to confirm deletion:
              </p>
              <input
                type="password" className="input" placeholder="Your password"
                value={deletePw} onChange={(e) => setDeletePw(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={!deletePw || deleting}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  style={{ background: '#712b13', color: '#fff' }}
                >
                  {deleting ? 'Deleting…' : 'Yes, delete everything'}
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeletePw('') }}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

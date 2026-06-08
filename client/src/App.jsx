import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Settings   from './pages/Settings'
import Export     from './pages/Export'
import Chapters   from './pages/Chapters'
import Characters from './pages/Characters'
import WorldBible from './pages/WorldBible'
import PlotOutline from './pages/PlotOutline'



export default function App() {
  const { token, fetchMe } = useAuthStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />

          <Route path="story/:storyId">
            <Route index element={<Navigate to="chapters" replace />} />
            <Route path="chapters"   element={<Chapters />} />
            <Route path="characters" element={<Characters />} />
            <Route path="world"      element={<WorldBible />} />
            <Route path="plot"       element={<PlotOutline />} />
            <Route path="export"     element={<Export />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

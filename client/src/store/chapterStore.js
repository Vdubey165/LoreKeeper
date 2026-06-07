import { create } from 'zustand'
import api from '../lib/api'

const useChapterStore = create((set, get) => ({
  chapters: [],
  activeChapter: null,
  loading: false,
  saving: false,
  lastSaved: null,

  fetchChapters: async (storyId) => {
    set({ loading: true })
    try {
      const { data } = await api.get(`/stories/${storyId}/chapters`)
      set({ chapters: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchChapter: async (storyId, id) => {
    try {
      const { data } = await api.get(`/stories/${storyId}/chapters/${id}`)
      set({ activeChapter: data })
      return data
    } catch {}
  },

  createChapter: async (storyId, payload) => {
    try {
      const { data } = await api.post(`/stories/${storyId}/chapters`, payload)
      set((s) => ({ chapters: [...s.chapters, data] }))
      return data
    } catch {}
  },

  saveChapter: async (storyId, id, payload) => {
    set({ saving: true })
    try {
      const { data } = await api.put(`/stories/${storyId}/chapters/${id}`, payload)
      set((s) => ({
        chapters: s.chapters.map((c) => (c._id === id ? { ...c, ...data } : c)),
        activeChapter: s.activeChapter?._id === id ? data : s.activeChapter,
        saving: false,
        lastSaved: new Date(),
      }))
    } catch {
      set({ saving: false })
    }
  },

  deleteChapter: async (storyId, id) => {
    try {
      await api.delete(`/stories/${storyId}/chapters/${id}`)
      set((s) => ({
        chapters: s.chapters.filter((c) => c._id !== id),
        activeChapter: s.activeChapter?._id === id ? null : s.activeChapter,
      }))
    } catch {}
  },

  reorderChapters: async (storyId, orderedIds) => {
    try {
      await api.post(`/stories/${storyId}/chapters/reorder`, { orderedIds })
    } catch {}
  },

  setActiveChapter: (chapter) => set({ activeChapter: chapter }),
  clearChapters: () => set({ chapters: [], activeChapter: null }),
}))

export default useChapterStore

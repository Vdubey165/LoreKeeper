import { create } from 'zustand'
import api from '../lib/api'

const useStoryStore = create((set, get) => ({
  stories: [],
  activeStory: null,
  loading: false,
  error: null,

  fetchStories: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get('/stories')
      set({ stories: data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message, loading: false })
    }
  },

  fetchStory: async (id) => {
    try {
      const { data } = await api.get(`/stories/${id}`)
      set({ activeStory: data })
      return data
    } catch (err) {
      set({ error: err.response?.data?.message })
    }
  },

  createStory: async (payload) => {
    try {
      const { data } = await api.post('/stories', payload)
      set((s) => ({ stories: [data, ...s.stories] }))
      return data
    } catch (err) {
      set({ error: err.response?.data?.message })
    }
  },

  updateStory: async (id, payload) => {
    try {
      const { data } = await api.put(`/stories/${id}`, payload)
      set((s) => ({
        stories: s.stories.map((st) => (st._id === id ? data : st)),
        activeStory: s.activeStory?._id === id ? data : s.activeStory,
      }))
      return data
    } catch (err) {
      set({ error: err.response?.data?.message })
    }
  },

  deleteStory: async (id) => {
    try {
      await api.delete(`/stories/${id}`)
      set((s) => ({
        stories: s.stories.filter((st) => st._id !== id),
        activeStory: s.activeStory?._id === id ? null : s.activeStory,
      }))
    } catch (err) {
      set({ error: err.response?.data?.message })
    }
  },

  setActiveStory: (story) => set({ activeStory: story }),
}))

export default useStoryStore

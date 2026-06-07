import { create } from 'zustand'
import api from '../lib/api'

const useWikiStore = create((set) => ({
  characters: [],
  worldEntries: [],
  loading: false,

  // Characters
  fetchCharacters: async (storyId) => {
    set({ loading: true })
    try {
      const { data } = await api.get(`/stories/${storyId}/characters`)
      set({ characters: data, loading: false })
    } catch { set({ loading: false }) }
  },

  createCharacter: async (storyId, payload) => {
    try {
      const { data } = await api.post(`/stories/${storyId}/characters`, payload)
      set((s) => ({ characters: [...s.characters, data] }))
      return data
    } catch {}
  },

  updateCharacter: async (storyId, id, payload) => {
    try {
      const { data } = await api.put(`/stories/${storyId}/characters/${id}`, payload)
      set((s) => ({ characters: s.characters.map((c) => (c._id === id ? data : c)) }))
      return data
    } catch {}
  },

  deleteCharacter: async (storyId, id) => {
    try {
      await api.delete(`/stories/${storyId}/characters/${id}`)
      set((s) => ({ characters: s.characters.filter((c) => c._id !== id) }))
    } catch {}
  },

  // World entries
  fetchWorldEntries: async (storyId, type) => {
    try {
      const url = type
        ? `/stories/${storyId}/world?type=${type}`
        : `/stories/${storyId}/world`
      const { data } = await api.get(url)
      set({ worldEntries: data })
    } catch {}
  },

  createWorldEntry: async (storyId, payload) => {
    try {
      const { data } = await api.post(`/stories/${storyId}/world`, payload)
      set((s) => ({ worldEntries: [...s.worldEntries, data] }))
      return data
    } catch {}
  },

  updateWorldEntry: async (storyId, id, payload) => {
    try {
      const { data } = await api.put(`/stories/${storyId}/world/${id}`, payload)
      set((s) => ({ worldEntries: s.worldEntries.map((e) => (e._id === id ? data : e)) }))
      return data
    } catch {}
  },

  deleteWorldEntry: async (storyId, id) => {
    try {
      await api.delete(`/stories/${storyId}/world/${id}`)
      set((s) => ({ worldEntries: s.worldEntries.filter((e) => e._id !== id) }))
    } catch {}
  },

  clearWiki: () => set({ characters: [], worldEntries: [] }),
}))

export default useWikiStore
